import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "@/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  const fetchProgress = useCallback(async () => {
    try {
      const { data } = await api.get("/progress");
      setProgress(data.progress || []);
      setUnlockedLevel(data.unlocked_level || 1);
    } catch (err) {
      // Not fatal — user might just be unauthenticated. Reset state and log for debug.
      console.warn("fetchProgress failed:", err?.message || err);
      setProgress([]);
      setUnlockedLevel(1);
    }
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      await fetchProgress();
    } catch (err) {
      // 401 on first load is expected for unauthenticated visitors.
      if (err?.response?.status && err.response.status !== 401) {
        console.warn("bootstrap failed:", err?.message || err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProgress]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    await fetchProgress();
    return data.user;
  }, [fetchProgress]);

  const register = useCallback(async (email, password, name) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    setUser(data.user);
    await fetchProgress();
    return data.user;
  }, [fetchProgress]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("logout failed:", err?.message || err);
    }
    setUser(null);
    setProgress([]);
    setUnlockedLevel(1);
  }, []);

  const saveProgress = useCallback(async ({ level_id, score, max_score, stars }) => {
    try {
      await api.post("/progress", { level_id, score, max_score, stars });
      await fetchProgress();
    } catch (err) {
      // Client-side progression still works if the save fails — just log.
      console.warn("saveProgress failed:", err?.message || err);
    }
  }, [fetchProgress]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, progress, unlockedLevel, saveProgress, fetchProgress }),
    [user, loading, login, register, logout, progress, unlockedLevel, saveProgress, fetchProgress]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
