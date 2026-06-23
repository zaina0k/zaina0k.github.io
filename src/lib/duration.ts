const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthLabel(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** True when endDate is null (project is ongoing). */
export function isOngoing(endDate: Date | null | undefined): boolean {
  return endDate == null;
}

/**
 * Whole-month difference between two dates (month precision only — day ignored).
 * Returns 0 when start and end are in the same month.
 */
function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

/**
 * Human-readable duration string: "3 months", "1 month", "< 1 month".
 * Ongoing projects (null endDate) return "Ongoing".
 */
export function formatDuration(startDate: Date, endDate: Date | null | undefined): string {
  if (isOngoing(endDate)) return 'Ongoing';
  const months = monthsBetween(startDate, endDate!);
  if (months === 0) return '< 1 month';
  if (months === 1) return '1 month';
  return `${months} months`;
}

/**
 * Date range label: "Nov 2024" for single-month projects, "Mar – May 2023" for
 * multi-month, "Mar 2023 – Present" for ongoing.
 */
export function formatDateRange(startDate: Date, endDate: Date | null | undefined): string {
  if (isOngoing(endDate)) return `${monthLabel(startDate)} – Present`;
  const months = monthsBetween(startDate, endDate!);
  if (months === 0) return monthLabel(startDate);
  return `${monthLabel(startDate)} – ${monthLabel(endDate!)}`;
}
