// The timer gets livelier as time runs out. Five phases, by seconds remaining,
// relative to the game length so short games still build up (5:00 game in brackets):
//   0  > 60% of total            calm         (> 3:00)
//   1  > max(20% of total, 30 s) warming up   (> 1:00)
//   2  > 0:30                    hot          (digits thump every second)
//   3  > 0:10                    no mercy     (red slab, ticking)
//   4  ≤ 0:10                    final        (shake, flashing background, high beeps)
// Thresholds are clamped to stay in order; a phase whose window is empty is skipped.

export type Phase = 0 | 1 | 2 | 3 | 4;

/** Lower bound (seconds left) of phases 0–3, for a game of `totalSeconds`. */
export function phaseThresholds(totalSeconds: number): [number, number, number, number] {
  const t3 = Math.min(10, totalSeconds);
  const t2 = Math.min(30, totalSeconds);
  const t1 = Math.min(Math.max(totalSeconds * 0.2, 30), totalSeconds);
  const t0 = Math.max(totalSeconds * 0.6, t1);
  return [t0, t1, t2, t3];
}

export function phaseOf(secondsLeft: number, totalSeconds: number): Phase {
  const [t0, t1, t2, t3] = phaseThresholds(totalSeconds);
  if (secondsLeft > t0) return 0;
  if (secondsLeft > t1) return 1;
  if (secondsLeft > t2) return 2;
  if (secondsLeft > t3) return 3;
  return 4;
}

/** Background ray rotation period (s) per phase. */
export const RAY_SPIN_S: Record<Phase, number> = { 0: 140, 1: 60, 2: 26, 3: 12, 4: 5 };

/** Timer slab wobble period (s) per phase. */
export const SLAB_WOBBLE_S: Record<Phase, number> = { 0: 5, 1: 3, 2: 1.6, 3: 0.8, 4: 0.45 };

/** Ray spin during the "time's up" burst and on the result sheet. */
export const SPIN_TIMES_UP_S = 3;
export const SPIN_RESULT_S = 90;
export const SPIN_QUICK_ENTRY_S = 140;
