import { JournalEntry } from '../types';

// Used for entries saved before per-entry progress existed, and as the
// starting value when a goal is linked to a new entry.
export const DEFAULT_ENTRY_PROGRESS = 10;

export function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** How much progress (0-100) a single entry contributed to a goal. */
export function entryProgressFor(entry: JournalEntry, goalId: string) {
  if (!entry.goalIds.includes(goalId)) return 0;
  const value = entry.goalProgress?.[goalId];
  return typeof value === 'number' ? clampProgress(value) : DEFAULT_ENTRY_PROGRESS;
}

/** Total progress for a goal: the sum of its entries' contributions, capped at 100%. */
export function calculateGoalProgress(goalId: string, entries: JournalEntry[]) {
  const total = entries.reduce((sum, entry) => sum + entryProgressFor(entry, goalId), 0);
  return Math.min(total, 100);
}
