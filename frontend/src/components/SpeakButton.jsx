import { speak, isTTSAvailable } from "@/lib/tts";

/**
 * Small 🔊 button that pronounces an English word/phrase via SpeechSynthesis.
 * Silent-fails when the browser has no TTS support.
 */
export default function SpeakButton({ text, label, size = 34, testid }) {
  if (!isTTSAvailable() || !text) return null;
  const onClick = (e) => {
    e.stopPropagation();
    speak(text);
  };
  return (
    <button
      type="button"
      className="speak-btn"
      onClick={onClick}
      style={{ width: size, height: size }}
      aria-label={label || `Pronunciar ${text}`}
      title={label || `Pronunciar "${text}"`}
      data-testid={testid || "speak-btn"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    </button>
  );
}
