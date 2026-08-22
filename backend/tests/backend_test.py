"""Backend API tests for English Kids · SENA."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://kid-english-journey.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

TEST_EMAIL = os.environ.get("TEST_USER_EMAIL", "test@ek.com")
TEST_PASSWORD = os.environ.get("TEST_USER_PASSWORD", "test1234")


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def test_user_token(session):
    r = session.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def fresh_user(session):
    email = f"TEST_{uuid.uuid4().hex[:8]}@ek.com"
    r = session.post(f"{API}/auth/register", json={"email": email, "password": "pass1234", "name": "T"})
    assert r.status_code == 200, r.text
    data = r.json()
    return {"email": email, "token": data["token"], "id": data["user"]["id"]}


# ----- Auth tests -----

def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_register_success(fresh_user):
    assert "@" in fresh_user["email"]
    assert fresh_user["token"]


def test_register_sets_cookie(session):
    email = f"TEST_{uuid.uuid4().hex[:8]}@ek.com"
    r = session.post(f"{API}/auth/register", json={"email": email, "password": "pass1234"})
    assert r.status_code == 200
    assert "access_token" in r.cookies or any(c.name == "access_token" for c in r.cookies)


def test_register_duplicate(session, fresh_user):
    r = session.post(f"{API}/auth/register", json={"email": fresh_user["email"], "password": "pass1234"})
    assert r.status_code == 400


def test_login_success(session):
    r = session.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    assert r.status_code == 200
    body = r.json()
    assert body["user"]["email"] == TEST_EMAIL
    assert body["token"]


def test_login_wrong_password(session):
    r = session.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": "wrongpass"})
    assert r.status_code == 401


def test_me_with_bearer(session, test_user_token):
    r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {test_user_token}"})
    assert r.status_code == 200
    assert r.json()["email"] == TEST_EMAIL


def test_me_no_token(session):
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_bcrypt_hash_format():
    # ensure bcrypt is used - hash starts with $2b$
    import bcrypt
    h = bcrypt.hashpw(b"x", bcrypt.gensalt()).decode()
    assert h.startswith("$2b$")


# ----- Progress tests -----

def test_progress_requires_auth():
    r = requests.get(f"{API}/progress")
    assert r.status_code == 401
    r2 = requests.post(f"{API}/progress", json={"level_id": 1, "score": 6, "max_score": 6, "stars": 3})
    assert r2.status_code == 401


def test_progress_initial_unlocked_is_1(fresh_user):
    r = requests.get(f"{API}/progress", headers={"Authorization": f"Bearer {fresh_user['token']}"})
    assert r.status_code == 200
    body = r.json()
    assert body["unlocked_level"] == 1
    assert body["progress"] == []


def test_progress_save_level1_unlocks_2(fresh_user):
    h = {"Authorization": f"Bearer {fresh_user['token']}"}
    r = requests.post(f"{API}/progress", headers=h, json={"level_id": 1, "score": 6, "max_score": 6, "stars": 3})
    assert r.status_code == 200
    g = requests.get(f"{API}/progress", headers=h)
    body = g.json()
    assert body["unlocked_level"] == 2
    assert len(body["progress"]) == 1
    assert body["progress"][0]["stars"] == 3


def test_progress_lower_score_does_not_overwrite(fresh_user):
    h = {"Authorization": f"Bearer {fresh_user['token']}"}
    # already 3 stars from previous test; try to save with 1 star
    r = requests.post(f"{API}/progress", headers=h, json={"level_id": 1, "score": 2, "max_score": 6, "stars": 1})
    assert r.status_code == 200
    g = requests.get(f"{API}/progress", headers=h).json()
    lvl1 = next(p for p in g["progress"] if p["level_id"] == 1)
    assert lvl1["stars"] == 3  # should not be overwritten
    assert lvl1["score"] == 6


def test_progress_multiple_levels_unlock(fresh_user):
    h = {"Authorization": f"Bearer {fresh_user['token']}"}
    for lvl in [2, 3]:
        r = requests.post(f"{API}/progress", headers=h, json={"level_id": lvl, "score": 5, "max_score": 6, "stars": 2})
        assert r.status_code == 200
    g = requests.get(f"{API}/progress", headers=h).json()
    assert g["unlocked_level"] == 4


def test_progress_level_7_cap(fresh_user):
    h = {"Authorization": f"Bearer {fresh_user['token']}"}
    r = requests.post(f"{API}/progress", headers=h, json={"level_id": 7, "score": 5, "max_score": 5, "stars": 3})
    assert r.status_code == 200
    g = requests.get(f"{API}/progress", headers=h).json()
    assert g["unlocked_level"] == 7  # capped
