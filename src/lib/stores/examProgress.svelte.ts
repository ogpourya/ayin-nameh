import { browser } from '$app/env';
import { CARTEX } from '#lib/data/cartex';

/** Legacy-compatible status codes stored per exam. */
export const STATUS = { none: 0, passed: 1, failed: 2, inProgress: 3 } as const;

const STATUS_KEY = (exam: number) => `status_${exam}`;
const VISITED_KEY = (exam: number) => `exam${exam}`;
const BOOKMARKS_KEY = 'bookmarks';
const HIDE_TEXTS_KEY = 'hide_texts';

class ExamProgress {
  statuses = $state<Record<number, number>>({});
  visited = $state<Record<number, boolean>>({});
  bookmarks = $state<string[]>([]);
  hideTexts = $state(false);
  ready = $state(false);

  constructor() {
    // Hydrate before any child effect can write; effects run before a parent's onMount.
    if (browser) this.init();
  }

  /** Load persisted state from localStorage. Client-only; call once on mount. */
  init() {
    if (!browser || this.ready) return;
    for (let exam = 1; exam <= CARTEX.length; exam += 1) {
      const status = Number(localStorage.getItem(STATUS_KEY(exam)) ?? 0);
      if (status === STATUS.passed || status === STATUS.failed || status === STATUS.inProgress) {
        this.statuses[exam] = status;
      }
      if (localStorage.getItem(VISITED_KEY(exam)) === 'true') this.visited[exam] = true;
    }
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]');
      if (Array.isArray(stored)) {
        this.bookmarks = stored.filter((key): key is string => typeof key === 'string');
      }
    } catch {
      // Corrupted bookmarks: start clean, keep the rest of the state.
    }
    this.hideTexts = localStorage.getItem(HIDE_TEXTS_KEY) === '1';
    this.ready = true;
  }

  getStatus(exam: number): number {
    return this.statuses[exam] ?? STATUS.none;
  }

  setStatus(exam: number, status: number) {
    this.statuses[exam] = status;
    this.#write(STATUS_KEY(exam), String(status));
  }

  /** Mark an exam as started unless it already has history (passed, failed or in progress). */
  startExam(exam: number) {
    if (this.getStatus(exam) === STATUS.none) this.setStatus(exam, STATUS.inProgress);
  }

  markVisited(exam: number) {
    if (this.visited[exam]) return;
    this.visited[exam] = true;
    this.#write(VISITED_KEY(exam), 'true');
  }

  isBookmarked(exam: number, questionId: number): boolean {
    return this.bookmarks.includes(`${exam}-${questionId}`);
  }

  toggleBookmark(exam: number, questionId: number) {
    const key = `${exam}-${questionId}`;
    const at = this.bookmarks.indexOf(key);
    if (at >= 0) this.bookmarks.splice(at, 1);
    else this.bookmarks.push(key);
    this.#write(BOOKMARKS_KEY, JSON.stringify(this.bookmarks));
  }

  bookmarkCountFor(exam: number): number {
    return this.bookmarks.filter((key) => key.startsWith(`${exam}-`)).length;
  }

  setHideTexts(hidden: boolean) {
    this.hideTexts = hidden;
    this.#write(HIDE_TEXTS_KEY, hidden ? '1' : '0');
  }

  get passedCount(): number {
    return Object.values(this.statuses).filter((s) => s === STATUS.passed).length;
  }

  get failedCount(): number {
    return Object.values(this.statuses).filter((s) => s === STATUS.failed).length;
  }

  get inProgressCount(): number {
    return Object.values(this.statuses).filter((s) => s === STATUS.inProgress).length;
  }

  #write(key: string, value: string) {
    if (!browser) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable (private mode): the app keeps working in memory.
    }
  }
}

export const progress = new ExamProgress();
