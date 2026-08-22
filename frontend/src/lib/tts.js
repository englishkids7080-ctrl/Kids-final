// Text-to-Speech using the browser's SpeechSynthesis API.
// Zero cost, offline-capable, works on all modern browsers.
let enabled = true;
let cachedVoice = null;

function pickEnglishVoice() {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  // Prefer en-US / en-GB female-ish voices, fall back to any en-*.
  const preferred =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|jenny|karen/i.test(v.name)) ||
    voices.find((v) => /en[-_]US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang));
  cachedVoice = preferred || null;
  return cachedVoice;
}

// Voices load asynchronously in most browsers; warm cache once.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickEnglishVoice();
  };
  pickEnglishVoice();
}

export function speak(text, { rate = 0.85, pitch = 1.05 } = {}) {
  if (!enabled || !text) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = "en-US";
    u.rate = rate;
    u.pitch = pitch;
    const v = pickEnglishVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch (err) {
    console.warn("TTS speak failed:", err?.message || err);
  }
}

export function setTTSEnabled(v) {
  enabled = !!v;
  if (!enabled && typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isTTSAvailable() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}
