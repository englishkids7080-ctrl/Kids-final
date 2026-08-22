import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/api/client";
import { sfx } from "@/lib/sound";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password.trim()) {
      setErr("Debes completar todos los campos obligatorios.");
      return;
    }
    if (password.length < 4) {
      setErr("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    if (password !== password2) {
      setErr("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, name.trim() || null);
      sfx.win();
      toast.success("Cuenta creada");
      nav("/landing");
    } catch (e2) {
      setErr(formatApiError(e2));
      sfx.wrong();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell" data-testid="register-page">
      <aside className="auth-hero">
        <div className="eyebrow">Proyecto SENA · Aprendizaje lúdico</div>
        <div>
          <h1>Crea tu cuenta y <em>comienza el viaje</em></h1>
          <p>
            7 niveles interactivos con memorama, quiz, colores, números, familia y comida en inglés.
            Guarda tu progreso y regresa cuando quieras.
          </p>
        </div>
        <div className="footer-note">
          <strong style={{ color: "rgba(241,243,236,.85)" }}>English Kids</strong> · Aprendizaje del
          inglés para primera infancia
        </div>
        <span className="decor">EK</span>
      </aside>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={onSubmit} data-testid="register-form">
          <div className="brand">
            <span className="mark">EK</span>
            <div>
              <div className="name">English Kids</div>
              <div className="sub">Proyecto SENA</div>
            </div>
          </div>

          <h2>Registro</h2>
          <p className="lead">
            Solo necesitas un correo y una contraseña para empezar.
          </p>

          {err && <div className="form-error" data-testid="register-error">{err}</div>}

          <div className="form-field">
            <label htmlFor="name">Nombre (opcional)</label>
            <input
              id="name"
              type="text"
              placeholder="Cómo quieres que te llamemos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="register-name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              data-testid="register-email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 4 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              data-testid="register-password"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password2">Confirmar contraseña</label>
            <input
              id="password2"
              type="password"
              placeholder="Repite la contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="new-password"
              data-testid="register-password2"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-block"
            disabled={loading}
            data-testid="register-submit"
            style={{ marginTop: 6 }}
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          <div className="form-alt">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" data-testid="link-login">Iniciar sesión</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
