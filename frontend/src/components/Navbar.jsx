import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sfx } from "@/lib/sound";

function getInitialTheme() {
  if (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark") return "dark";
  try {
    return localStorage.getItem("ek-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("ek-theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => {
    sfx.click();
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

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
        <button
          className={`nav-link ${isActive("/badges") ? "active" : ""}`}
          onClick={() => go("/badges")}
          data-testid="nav-badges"
        >
          Medallas
        </button>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          data-testid="theme-toggle"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user && <span className="nav-user" data-testid="nav-username">{user.name || user.email}</span>}
        <button className="nav-link" onClick={logout} data-testid="nav-logout">Salir</button>
      </div>
    </nav>
  );
}
