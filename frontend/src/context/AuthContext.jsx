import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import api from "@/api/client";
import { sfx } from "@/lib/sound";
import { earnedBadgeIds, getBadge } from "@/lib/badges";

const AuthContext = createContext(null);

const GUEST_FLAG = "ek-guest";
const GUEST_PROGRESS = "ek-guest-progress";
const GUEST_USER = { id: "guest", email: null, name: "Invitado", role: "guest", guest: true };

function readGuestProgress() {
  try { return JSON.parse(localStorage.getItem(GUEST_PROGRESS) || "[]"); } catch { return []; }
}
function writeGuestProgress(list) {
  try { localStorage.setItem(GUEST_PROGRESS, JSON.stringify(list)); } catch { /* ignore */ }
}
function unlockedFrom(list) {
  const highest = list.reduce((m, p) => Math.max(m, p.level_id), 0);
  return list.length ? Math.min(7, highest + 1) : 1;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
  const progressRef = useRef([]);
  const isGuestRef = useRef(false);

  const notifyNewBadges = useCallback((before, after) => {
    after.forEach((id) => {
      if (!before.has(id)) {
        const b = getBadge(id);
        if (b) {
          sfx.badge();
          toast.success(`🏅 ¡Nueva medalla: ${b.title}!`, { description: b.desc });
        }
      }
    });
  }, []);

  const fetchProgress = useCallback(async () => {
    if (isGuestRef.current) {
      const list = readGuestProgress();
      setProgress(list);
      setUnlockedLevel(unlockedFrom(list));
      progressRef.current = list;
      return list;
    }
    try {
      const { data } = await api.get("/progress");
      const list = data.progress || [];
      setProgress(list);
      setUnlockedLevel(data.unlocked_level || 1);
      progressRef.current = list;
      return list;
    } catch (err) {
      console.warn("fetchProgress failed:", err?.message || err);
      setProgress([]);
      setUnlockedLevel(1);
      progressRef.current = [];
      return [];
    }
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      if (localStorage.getItem(GUEST_FLAG) === "1") {
        isGuestRef.current = true;
        setIsGuest(true);
        setUser(GUEST_USER);
        await fetchProgress();
        setLoading(false);
        return;
      }
    } catch { /* ignore */ }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      await fetchProgress();
    } catch (err) {
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

  const exitGuestMode = () => {
    isGuestRef.current = false;
    setIsGuest(false);
    try { localStorage.removeItem(GUEST_FLAG); } catch { /* ignore */ }
  };

  const loginAsGuest = useCallback(async () => {
    try { localStorage.setItem(GUEST_FLAG, "1"); } catch { /* ignore */ }
    isGuestRef.current = true;
    setIsGuest(true);
    setUser(GUEST_USER);
    await fetchProgress();
    return GUEST_USER;
  }, [fetchProgress]);

  const login = useCallback(async (email, password) => {
    exitGuestMode();
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    await fetchProgress();
    return data.user;
  }, [fetchProgress]);

  const register = useCallback(async (email, password, name) => {
    exitGuestMode();
    const { data } = await api.post("/auth/register", { email, password, name });
    setUser(data.user);
    await fetchProgress();
    return data.user;
  }, [fetchProgress]);

  const logout = useCallback(async () => {
    if (isGuestRef.current) {
      exitGuestMode();
      setUser(null);
      setProgress([]);
      setUnlockedLevel(1);
      progressRef.current = [];
      return;
    }
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("logout failed:", err?.message || err);
    }
    setUser(null);
    setProgress([]);
    setUnlockedLevel(1);
    progressRef.current = [];
  }, []);

  const saveProgress = useCallback(async ({ level_id, score, max_score, stars }) => {
    const before = earnedBadgeIds(progressRef.current);

    if (isGuestRef.current) {
      const list = readGuestProgress();
      const entry = { level_id, score, max_score, stars, completed_at: new Date().toISOString() };
      const idx = list.findIndex((p) => p.level_id === level_id);
      if (idx >= 0) {
        const ex = list[idx];
        if (stars > (ex.stars || 0) || score > (ex.score || 0)) list[idx] = entry;
      } else {
        list.push(entry);
      }
      writeGuestProgress(list);
      setProgress(list);
      setUnlockedLevel(unlockedFrom(list));
      progressRef.current = list;
      notifyNewBadges(before, earnedBadgeIds(list));
      return;
    }

    try {
      await api.post("/progress", { level_id, score, max_score, stars });
      const list = await fetchProgress();
      notifyNewBadges(before, earnedBadgeIds(list));
    } catch (err) {
      console.warn("saveProgress failed:", err?.message || err);
    }
  }, [fetchProgress, notifyNewBadges]);

  const value = useMemo(
    () => ({ user, loading, isGuest, login, register, logout, loginAsGuest, progress, unlockedLevel, saveProgress, fetchProgress }),
    [user, loading, isGuest, login, register, logout, loginAsGuest, progress, unlockedLevel, saveProgress, fetchProgress]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
