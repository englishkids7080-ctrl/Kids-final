import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/api/client";
import { sfx } from "@/lib/sound";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password.trim()) {
      setErr("Debes completar todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      sfx.win();
      toast.success("Bienvenido de nuevo");
      nav("/landing");
    } catch (e2) {
      const msg = formatApiError(e2);
      setErr(msg);
      sfx.wrong();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell" data-testid="login-page">
      <aside className="auth-hero">
        <div className="eyebrow">Proyecto SENA · Aprendizaje lúdico</div>
        <div>
          <h1>
            Un viaje de <em>7 niveles</em> para conocer el inglés desde niños
          </h1>
          <p>
            English Kids es una herramienta web educativa que introduce vocabulario básico en
            inglés mediante actividades interactivas breves.
          </p>
        </div>
        <div className="footer-note">
          <strong style={{ color: "rgba(241,243,236,.85)" }}>English Kids</strong> · Institución
          Educativa Gonzalo Rivera Laguardo · SENA
        </div>
        <span className="decor">EK</span>
      </aside>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={onSubmit} data-testid="login-form">
          <div className="brand">
            <span className="mark">EK</span>
            <div>
              <div className="name">English Kids</div>
              <div className="sub">Proyecto SENA</div>
            </div>
          </div>

          <h2>Iniciar sesión</h2>
          <p className="lead">Accede con tu correo electrónico para continuar tu progreso.</p>

          {err && <div className="form-error" data-testid="login-error">{err}</div>}

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              data-testid="login-email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              data-testid="login-password"
              required
            />
          </div>

          <div className="form-inline">
            <input
              id="show-pw"
              type="checkbox"
              checked={showPw}
              onChange={(e) => setShowPw(e.target.checked)}
              data-testid="login-show-pw"
            />
            <label htmlFor="show-pw" style={{ margin: 0, fontWeight: 500 }}>
              Mostrar contraseña
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-block"
            disabled={loading}
            data-testid="login-submit"
          >
            {loading ? "Ingresando…" : "Iniciar sesión"}
          </button>

          <div className="form-alt">
            ¿No tienes cuenta?{" "}
            <Link to="/register" data-testid="link-register">Regístrate</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
