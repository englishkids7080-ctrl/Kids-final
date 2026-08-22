// Simple Web Audio-based feedback sounds. No external deps.
let ctx = null;
let enabled = true;

function getCtx() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    } catch (err) {
      // Web Audio unsupported or blocked. Log once and disable further attempts silently.
      console.warn("AudioContext unavailable:", err?.message || err);
      enabled = false;
    }
  }
  return ctx;
}

function tone(freq, duration = 0.15, type = "sine", gain = 0.08, delay = 0) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  correct() {
    tone(660, 0.12, "sine", 0.08);
    tone(880, 0.18, "sine", 0.08, 0.08);
  },
  wrong() {
    tone(220, 0.2, "sawtooth", 0.06);
  },
  flip() {
    tone(500, 0.05, "triangle", 0.05);
  },
  win() {
    tone(660, 0.12, "sine", 0.08);
    tone(880, 0.12, "sine", 0.08, 0.12);
    tone(1050, 0.22, "sine", 0.08, 0.24);
  },
  click() {
    tone(420, 0.04, "square", 0.04);
  },
  badge() {
    tone(784, 0.12, "sine", 0.08);
    tone(988, 0.12, "sine", 0.08, 0.12);
    tone(1319, 0.14, "sine", 0.08, 0.24);
    tone(1568, 0.3, "sine", 0.08, 0.38);
  },
};

export function setSoundEnabled(v) {
  enabled = !!v;
}
export function isSoundEnabled() {
  return enabled;
}
