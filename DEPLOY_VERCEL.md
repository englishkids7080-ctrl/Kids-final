# 🚀 Desplegar English Kids en Vercel

Este proyecto ya quedó **listo para Vercel**. Solo tienes que crear la base de datos
en la nube, subir el código a GitHub y conectar Vercel. Sigue estos pasos.

Arquitectura en Vercel:
- **Frontend** (React) → se publica como sitio estático.
- **Backend** (FastAPI) → corre como *función serverless* de Python en `api/index.py`.
- **Base de datos** → MongoDB Atlas (gratis).

Todo vive en el mismo dominio, así que el frontend llama a `/api/...` (mismo origen).

---

## 1) Crear la base de datos (MongoDB Atlas — gratis)

1. Entra a https://www.mongodb.com/cloud/atlas/register y crea una cuenta.
2. Crea un **Cluster gratuito** (M0).
3. En **Database Access** → crea un usuario y contraseña (guárdalos).
4. En **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
5. En **Database → Connect → Drivers**, copia la cadena de conexión. Se ve así:
   ```
   mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   👉 Reemplaza `USUARIO` y `CONTRASEÑA` por los que creaste.

---

## 2) Subir el código a GitHub

Desde la raíz del proyecto:
```bash
git init
git add .
git commit -m "English Kids listo para Vercel"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/english-kids.git
git push -u origin main
```

---

## 3) Importar el proyecto en Vercel

1. Entra a https://vercel.com y haz **Add New… → Project**.
2. Importa tu repositorio de GitHub.
3. **Root Directory**: déjalo en la raíz (donde está `vercel.json`). No cambies nada más;
   el archivo `vercel.json` ya configura el build del frontend y la función de Python.
4. **Framework Preset**: *Other* (lo controla `vercel.json`).

---

## 4) Configurar las variables de entorno en Vercel

En **Settings → Environment Variables**, agrega estas (para *Production* y *Preview*):

| Nombre                 | Valor de ejemplo                                             | Descripción |
|------------------------|-------------------------------------------------------------|-------------|
| `MONGO_URL`            | `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/...`     | Tu cadena de Atlas |
| `DB_NAME`              | `english_kids`                                              | Nombre de la base de datos |
| `JWT_SECRET`           | `una-clave-larga-y-secreta-cambia-esto`                     | Firma de sesiones (inventa una) |
| `CORS_ORIGINS`         | `*`                                                         | Orígenes permitidos |
| `ADMIN_EMAIL`          | `admin@englishkids.com`                                     | (Opcional) admin inicial |
| `ADMIN_PASSWORD`       | `admin1234`                                                 | (Opcional) contraseña admin |
| `REACT_APP_BACKEND_URL`| *(déjala vacía)*                                            | Mismo dominio → el front llama a `/api` |

> Importante: `MONGO_URL`, `DB_NAME` y `JWT_SECRET` son **obligatorias** o el backend no arranca.

---

## 5) Deploy

Pulsa **Deploy**. Cuando termine:
- Tu app estará en `https://tu-proyecto.vercel.app`
- El backend responde en `https://tu-proyecto.vercel.app/api/...`
- El admin inicial (si dejaste `ADMIN_EMAIL`/`ADMIN_PASSWORD`) queda creado automáticamente.

Cada `git push` a `main` vuelve a desplegar solo. ✅

---

## Archivos que dejé preparados para ti
- `vercel.json` — configura build de frontend + función Python y las rutas.
- `api/index.py` — punto de entrada serverless que carga tu FastAPI (`backend/server.py`).
- `api/requirements.txt` — dependencias mínimas del backend para producción.
- `frontend/.env.production` — deja `REACT_APP_BACKEND_URL` vacío (mismo origen).
- `.vercelignore` — evita subir archivos innecesarios.

---

## Notas y límites (importante)
- Vercel ejecuta el backend como **funciones serverless**: en tráfico bajo puede haber un
  pequeño “arranque en frío” (la primera petición tarda ~1 s). Para un proyecto escolar es perfecto.
- La base de datos **NO** vive en Vercel; vive en MongoDB Atlas (por eso el paso 1).
- Si prefieres un despliegue de un clic con todo incluido (frontend + backend + base de datos),
  también puedes usar el botón **Deploy** de Emergent. Vercel es totalmente válido con esta guía.
- Las cookies de sesión funcionan porque frontend y backend comparten dominio en Vercel.
