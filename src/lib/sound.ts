// Tiny synth beeps + vibration for the game timer (browser only).

const SOUND_KEY = "zp_sound";
let ctx: AudioContext | null = null;

export function isSoundOn() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

/** Must be called from a user gesture (the Start button) so browsers allow audio. */
export function unlockAudio() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null;
  }
}

export function beep(freq: number, duration = 0.08, type: OscillatorType = "square", volume = 0.08) {
  if (!ctx || !isSoundOn()) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch {
    /* ignore */
  }
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

/* Named cues, so the timer reads like a score sheet */
export const cues = {
  start: () => beep(660, 0.12),
  phaseUp: (phase: number) => {
    beep(440 + phase * 110, 0.18, "triangle", 0.1);
    vibrate(80);
  },
  tickWarm: () => beep(520, 0.04, "square", 0.04),
  tickHot: () => beep(620, 0.05, "square", 0.05),
  tickFinal: (sec: number) => {
    beep(sec <= 3 ? 1046 : 880, 0.09);
    vibrate(40);
  },
  timesUp: () => {
    beep(196, 0.5, "sawtooth", 0.12);
    setTimeout(() => beep(147, 0.7, "sawtooth", 0.12), 180);
    vibrate([200, 80, 300]);
  },
  saved: () => {
    beep(880, 0.1);
    setTimeout(() => beep(1320, 0.15), 110);
  },
  toggle: () => beep(660, 0.08),
};
