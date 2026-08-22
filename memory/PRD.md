# English Kids — PRD

## Problem statement (original, ES)
App web para que niños pequeños aprendan inglés. Pedidos del usuario:
1. Expandir los juegos (eran muy cortos) → "muchos más".
2. Juegos en inglés y español (inglés principal, español de apoyo).
3. Cada juego con una imagen (fotos reales de banco de imágenes) de lo que trata.
4. Certificado: quitar "SENA" y emitirlo a nombre de "English Kids" (solo texto).
5. (Follow-up) La interfaz se veía "muy IA" → darle profesionalismo.

## Stack / architecture
- Frontend: React (CRA + craco), Tailwind + custom App.css, react-router.
- Backend: FastAPI + MongoDB (motor). JWT httponly-cookie auth.
- Auth: register/login/logout/me + progress (GET/POST). Completar niveles 1..7 desbloquea el certificado.

## User personas
- Niños 5–9 años (juegan los niveles).
- Padres/docentes (ven landing y certificado imprimible).

## Core requirements (static)
- 7 niveles secuenciales, progreso persistido por usuario, certificado al completar todo.
- Contenido bilingüe EN/ES en todos los juegos.
- Imagen real por juego (level hero + thumbnail en el mapa).

## Implemented (with dates)
- 2026-08-22: Contenido de juegos expandido en `lib/gameData.js` — Alphabet 26, Numbers 1–20, Colors 12, Animals 12, Family 12, Food 18 preguntas, Final Quiz 20. Añadido campo `es` y `LEVEL_IMAGES`.
- 2026-08-22: Juegos por rondas para "muchos más" sin saturar pantalla — `PairMatchGame` (perRound=6) y `AnimalsGame` (memory, PER_ROUND=6). Verificado end-to-end (avance de rondas + guardado de progreso).
- 2026-08-22: Bilingüe EN + ES en Level hero, mapa, PairMatch (palabra + es), QuizGame (q + qEs), Colors, barras de progreso.
- 2026-08-22: Fotos reales por juego (level hero + thumbnail en `MapPage`).
- 2026-08-22: Certificado rebrandeado a "English Kids" (header, sello, firmas, footer) — 0 ocurrencias de "SENA". También limpiado en Navbar, App title, MapPage CTA, Login/Register.
- 2026-08-22: Backend `.env` con JWT_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD; admin seed admin@englishkids.com / admin1234.
- 2026-08-22: Rediseño "Vibrant Play" (design_agent) aplicado en App.css — paleta azul cielo + amarillo + verde, fuentes Fredoka/Nunito, botones 3D redondeados, tarjetas rounded, estados correcto=verde / error=rosa. Sin cambios de lógica.

## Backlog / remaining
- 2026-08-22: Medallas/recompensas (`lib/badges.js`, `pages/Badges.jsx`, strip en `MapPage`) — 7 medallas derivadas del progreso (primer nivel, 3 estrellas, racha de 3, coleccionista, 5 niveles, 7 niveles, perfección). Toast + sonido al ganar una nueva.
- 2026-08-22: Voz mejorada (`lib/tts.js`) — selección de mejor voz inglesa del navegador, ritmo más lento y tono amable; auto al aparecer (colores) y al tocar 🔊 / palabras en parejas.
- 2026-08-22: Modo "Practicar los errores" en Quiz/Colores/Parejas — repite solo lo fallado y NO sobreescribe el progreso guardado (verificado por interceptación de red).
- 2026-08-22: Modo oscuro con interruptor en el navbar (persiste en localStorage `ek-theme`, `data-theme` en <html>, sin parpadeo). Feedback de color reforzado en botones y fichas al hover/press.

### Pendientes
- P1: Voces nativas reales (TTS de servicio) en vez de SpeechSynthesis del navegador.
- P2: Panel de docente para ver desempeño por grupo.
- P2: Más categorías léxicas / niveles.

## Test credentials
Ver `/app/memory/test_credentials.md` (admin@englishkids.com / admin1234).
