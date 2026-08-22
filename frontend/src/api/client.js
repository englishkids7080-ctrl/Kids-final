import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Auth is handled entirely through httpOnly `access_token` cookie set by the backend.
// Frontend never touches the token directly (no localStorage, no memory copy) — this
// avoids XSS token theft while still allowing normal same-origin requests to carry it.
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

export function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || "Ocurrió un error. Intenta de nuevo.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;
