import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  const go = (path) => nav(path);
  const isActive = (path) => loc.pathname.startsWith(path);

  return (
    <nav className="ek-nav" data-testid="main-nav">
      <div className="ek-logo" onClick={() => go("/landing")} data-testid="nav-logo">
        <span className="mark">EK</span>
        <span>
          English Kids
          <span className="sub">Aprende inglés jugando</span>
        </span>
      </div>
      <div className="nav-actions">
        <button
          className={`nav-link ${isActive("/landing") ? "active" : ""}`}
          onClick={() => go("/landing")}
          data-testid="nav-project"
        >
          Proyecto
        </button>
        <button
          className={`nav-link ${isActive("/map") || isActive("/level") ? "active" : ""}`}
          onClick={() => go("/map")}
          data-testid="nav-map"
        >
          Mapa
        </button>
        {user && <span className="nav-user" data-testid="nav-username">{user.name || user.email}</span>}
        <button className="nav-link" onClick={logout} data-testid="nav-logout">Salir</button>
      </div>
    </nav>
  );
}
