// Tiny synth beeps + vibration for the game timer and button presses (browser only).

const SOUND_KEY = "zp_sound";
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

type AudioSessionType = "auto" | "playback" | "transient" | "transient-solo" | "ambient" | "play-and-record";
type NavigatorWithSession = Navigator & { audioSession?: { type: AudioSessionType } };

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

/** iOS mutes Web Audio with the ringer switch unless the page asks for "playback" (Safari 16.4+). */
function setAudioSession(type: AudioSessionType) {
  try {
    const session = (navigator as NavigatorWithSession).audioSession;
    if (session) session.type = type;
  } catch {
    /* ignore */
  }
}

/** Resume a suspended (or iOS "interrupted") context. Safe to call anywhere. */
function wake() {
  if (ctx && ctx.state !== "running") void ctx.resume().catch(() => {});
}

/**
 * Create and resume the AudioContext. Must run synchronously inside a user gesture
 * (click / pointerup / keydown) so browsers allow audio — no `await` before it.
 * `playback: true` (game timer, sound toggle) makes iOS play through the silent switch.
 */
export function unlockAudio({ playback = false } = {}) {
  try {
    if (playback) setAudioSession("playback");
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) wake();
      });
    }
    if (ctx.state !== "running") {
      wake();
      // A 1-sample silent buffer started inside the gesture fully unlocks iOS.
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, 22050);
      src.connect(ctx.destination);
      src.start(0);
    }
  } catch {
    ctx = null;
  }
}

/** Hand the iOS audio session back (music in other apps, silent switch) once the timer is closed. */
export function releaseAudioSession() {
  setAudioSession("auto");
}

/** True once a gesture has started the context, so sounds can play right away. */
export function isAudioRunning() {
  return ctx?.state === "running";
}

export function beep(freq: number, duration = 0.08, type: OscillatorType = "square", volume = 0.08) {
  if (!ctx || !isSoundOn()) return;
  wake();
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

/** Low "thunk" of a chunky button: sine dropping 180 → 60 Hz, plus a short filtered noise click. */
function thunk() {
  if (!ctx || !isSoundOn()) return;
  wake();
  try {
    const ac = ctx;
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const body = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);
    body.gain.setValueAtTime(0.0001, t);
    body.gain.exponentialRampToValueAtTime(0.22, t + 0.004);
    body.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
    osc.connect(body).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.09);

    noise ??= (() => {
      const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * 0.015), ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    })();
    const click = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const clickGain = ac.createGain();
    click.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.8;
    clickGain.gain.setValueAtTime(0.05, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
    click.connect(filter).connect(clickGain).connect(ac.destination);
    click.start(t);
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
  thunk,
};
