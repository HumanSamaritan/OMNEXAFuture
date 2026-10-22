export type PilotLifecycle = {
  firstUsedAt: string | null;
  withdrawnAt?: string | null;
  completedAt?: string | null;
  endAt?: string | null;
};
export type FeedbackCycle = { month: number; dueAt: string; status: "pending" | "sent" | "received" | "skipped" };
export function addCalendarMonths(date: Date, months: number): Date {
  if (!Number.isInteger(months) || months < 0) throw new Error("Invalid month count");
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return result;
}
export function pilotSchedule(firstUsedAt: string): { endAt: string; feedbackDueAt: string[] } {
  const first = new Date(firstUsedAt);
  if (!Number.isFinite(first.getTime())) throw new Error("Invalid first use timestamp");
  return {
    endAt: addCalendarMonths(first, 6).toISOString(),
    feedbackDueAt: Array.from({ length: 6 }, (_, i) => addCalendarMonths(first, i + 1).toISOString())
  };
}
export function isDue(cycle: FeedbackCycle, now = new Date()): boolean {
  return cycle.status === "pending" && new Date(cycle.dueAt).getTime() <= now.getTime();
}
export function isPilotComplete(record: PilotLifecycle, now = new Date()): boolean {
  if (!record.firstUsedAt || record.withdrawnAt) return false;
  const end = record.endAt ? new Date(record.endAt) : addCalendarMonths(new Date(record.firstUsedAt), 6);
  return Number.isFinite(end.getTime()) && now.getTime() >= end.getTime();
}
