// Achievement badges. All computed from the user's progress array
// (each item: { level_id, score, max_score, stars }). No extra storage needed.

function longestStreak(progress = []) {
  const ids = [...new Set(progress.map((p) => p.level_id))].sort((a, b) => a - b);
  let best = 0, cur = 0, prev = null;
  for (const id of ids) {
    if (prev !== null && id === prev + 1) cur += 1;
    else cur = 1;
    best = Math.max(best, cur);
    prev = id;
  }
  return best;
}

export const BADGES = [
  { id: "first_step", icon: "🎈", title: "Primer Paso", titleEn: "First Step",
    desc: "Completa tu primer nivel", check: (p) => p.length >= 1 },
  { id: "gold_star", icon: "⭐", title: "Estrella Dorada", titleEn: "Gold Star",
    desc: "Consigue 3 estrellas en un nivel", check: (p) => p.some((x) => x.stars >= 3) },
  { id: "streak3", icon: "🔥", title: "En Racha", titleEn: "On a Streak",
    desc: "Completa 3 niveles seguidos", check: (p) => longestStreak(p) >= 3 },
  { id: "collector", icon: "🌟", title: "Coleccionista", titleEn: "Star Collector",
    desc: "3 estrellas en 3 niveles diferentes", check: (p) => p.filter((x) => x.stars >= 3).length >= 3 },
  { id: "unstoppable", icon: "🚀", title: "Imparable", titleEn: "Unstoppable",
    desc: "Completa 5 niveles", check: (p) => p.length >= 5 },
  { id: "champion", icon: "🏆", title: "Campeón", titleEn: "Champion",
    desc: "Completa los 7 niveles", check: (p) => p.length >= 7 },
  { id: "perfect", icon: "👑", title: "Perfección Total", titleEn: "Perfect Score",
    desc: "3 estrellas en los 7 niveles", check: (p) => p.length >= 7 && p.every((x) => x.stars >= 3) },
];

export function computeBadges(progress = []) {
  return BADGES.map((b) => ({
    id: b.id, icon: b.icon, title: b.title, titleEn: b.titleEn, desc: b.desc,
    earned: b.check(progress),
  }));
}

export function earnedBadgeIds(progress = []) {
  return new Set(BADGES.filter((b) => b.check(progress)).map((b) => b.id));
}

export function getBadge(id) {
  return BADGES.find((b) => b.id === id) || null;
}
