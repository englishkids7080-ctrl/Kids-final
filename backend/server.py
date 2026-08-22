from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field


# ---------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("english-kids")

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day (kid-friendly, low security context)


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


# ---------------------------------------------------------------------
# Password / JWT helpers
# ---------------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


# ---------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4, max_length=100)
    name: Optional[str] = Field(default=None, max_length=60)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    role: str = "student"


class AuthResponse(BaseModel):
    user: UserOut
    token: str


class LevelProgressIn(BaseModel):
    level_id: int = Field(ge=1, le=7)
    score: int = Field(ge=0)
    max_score: int = Field(ge=1)
    stars: int = Field(ge=0, le=3)


class LevelProgressOut(BaseModel):
    level_id: int
    score: int
    max_score: int
    stars: int
    completed_at: str


# ---------------------------------------------------------------------
# App + Router
# ---------------------------------------------------------------------
app = FastAPI(title="English Kids")
api_router = APIRouter(prefix="/api")


def _user_doc_to_out(doc: Dict[str, Any]) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        email=doc["email"],
        name=doc.get("name"),
        role=doc.get("role", "student"),
    )


async def get_current_user(request: Request) -> Dict[str, Any]:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ---------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(payload: RegisterRequest, response: Response):
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Este correo ya está registrado.")
    doc = {
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": (payload.name or email.split("@")[0]).strip(),
        "role": "student",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    token = create_access_token(str(result.inserted_id), email)
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        secure=False, samesite="lax",
        max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
    )
    return AuthResponse(user=_user_doc_to_out(doc), token=token)


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        secure=False, samesite="lax",
        max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
    )
    return AuthResponse(user=_user_doc_to_out(user), token=token)


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return _user_doc_to_out(user)


# ---------------------------------------------------------------------
# Progress endpoints
# ---------------------------------------------------------------------
@api_router.get("/progress")
async def get_progress(user=Depends(get_current_user)):
    cursor = db.progress.find({"user_id": str(user["_id"])})
    items = await cursor.to_list(length=100)
    out = []
    for it in items:
        out.append({
            "level_id": it["level_id"],
            "score": it.get("score", 0),
            "max_score": it.get("max_score", 1),
            "stars": it.get("stars", 0),
            "completed_at": it.get("completed_at", ""),
        })
    highest = max([0] + [i["level_id"] for i in out])
    unlocked = min(7, highest + 1) if out else 1
    return {"progress": out, "unlocked_level": unlocked}


@api_router.post("/progress")
async def save_progress(payload: LevelProgressIn, user=Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "user_id": str(user["_id"]),
        "level_id": payload.level_id,
        "score": payload.score,
        "max_score": payload.max_score,
        "stars": payload.stars,
        "completed_at": now,
    }
    existing = await db.progress.find_one({
        "user_id": doc["user_id"], "level_id": doc["level_id"],
    })
    if existing:
        if payload.stars > existing.get("stars", 0) or payload.score > existing.get("score", 0):
            await db.progress.update_one({"_id": existing["_id"]}, {"$set": doc})
    else:
        await db.progress.insert_one(doc)
    return {"ok": True}


@api_router.get("/")
async def root():
    return {"app": "English Kids", "status": "ok"}


# ---------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.progress.create_index([("user_id", 1), ("level_id", 1)], unique=True)

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@englishkids.sena")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin1234")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ---------------------------------------------------------------------
# Wire router + CORS
# ---------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
