// Text-to-Speech using the browser's SpeechSynthesis API.
// Zero cost, offline-capable, works on all modern browsers.
let enabled = true;
let cachedVoice = null;

function scoreVoice(v) {
  // Higher score = better/clearer English voice for kids.
  let s = 0;
  if (/en[-_]US/i.test(v.lang)) s += 5;
  else if (/en[-_]GB/i.test(v.lang)) s += 4;
  else if (/^en/i.test(v.lang)) s += 3;
  if (/google/i.test(v.name)) s += 4;          // Google voices are clear & natural
  if (/natural|neural|premium/i.test(v.name)) s += 4;
  if (/samantha|jenny|aria|karen|zira|female/i.test(v.name)) s += 2;
  return s;
}

function pickEnglishVoice() {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const pool = english.length ? english : voices;
  cachedVoice = [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
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

export function speak(text, { rate = 0.82, pitch = 1.1 } = {}) {
  if (!enabled || !text) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = "en-US";
    u.rate = rate;   // a little slow so children hear each sound clearly
    u.pitch = pitch; // slightly brighter, friendlier tone
    const v = pickEnglishVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    // Chrome sometimes pauses long-idle synth; nudge it back.
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
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
