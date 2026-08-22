import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Landing from "@/pages/Landing";
import MapPage from "@/pages/MapPage";
import Level from "@/pages/Level";
import Certificate from "@/pages/Certificate";
import "@/App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="ek-loading">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="ek-loading">Cargando…</div>;
  if (user) return <Navigate to="/landing" replace />;
  return children;
}

function AppRoutes() {
  useEffect(() => {
    document.title = "English Kids · Aprende inglés jugando";
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/landing" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
      <Route path="/level/:id" element={<ProtectedRoute><Level /></ProtectedRoute>} />
      <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
