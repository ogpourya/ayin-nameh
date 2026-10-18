/** Official cartex rule: pass with at least 26 correct answers and at most 4 mistakes. */
export const PASS_RULES = { minCorrect: 26, maxWrong: 4 } as const;

/** Short exams (fewer questions than the official 30) scale the correct-answer threshold down. */
export const minCorrectFor = (total: number): number =>
  Math.min(PASS_RULES.minCorrect, Math.max(1, total - PASS_RULES.maxWrong));

export const isPassed = (correct: number, wrong: number, total: number): boolean =>
  correct >= minCorrectFor(total) && wrong <= PASS_RULES.maxWrong;
