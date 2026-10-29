// The timer gets livelier as time runs out. Five phases, by seconds remaining.
//   0  > 3:00   calm
//   1  > 1:00   warming up
//   2  > 0:30   hot        (digits thump every second)
//   3  > 0:10   no mercy   (red slab, ticking)
//   4  ≤ 0:10   final      (shake, flashing background, high beeps)

export type Phase = 0 | 1 | 2 | 3 | 4;

export function phaseOf(secondsLeft: number): Phase {
  if (secondsLeft > 180) return 0;
  if (secondsLeft > 60) return 1;
  if (secondsLeft > 30) return 2;
  if (secondsLeft > 10) return 3;
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
