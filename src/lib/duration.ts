const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDateLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** True when endDate is null (project is ongoing). */
export function isOngoing(endDate: Date | null | undefined): boolean {
  return endDate == null;
}

/** Whole calendar days between two dates. */
function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Human-readable duration string: "N days", "1 day", "< 1 day", "Ongoing".
 */
export function formatDuration(startDate: Date, endDate: Date | null | undefined): string {
  if (isOngoing(endDate)) return 'Ongoing';
  const days = daysBetween(startDate, endDate!);
  if (days <= 0) return '< 1 day';
  if (days === 1) return '1 day';
  return `${days} days`;
}

/**
 * Date range label with day precision.
 * Same day:             "1 Nov 2024"
 * Same month/year:      "1–15 Nov 2024"
 * Different month, same year: "1 Nov – 3 Dec 2024"
 * Different year:       "1 Nov 2024 – 3 Jan 2025"
 * Ongoing:              "1 Nov 2024 – Present"
 */
export function formatDateRange(startDate: Date, endDate: Date | null | undefined): string {
  if (isOngoing(endDate)) return `${shortDateLabel(startDate)} – Present`;

  const end = endDate!;
  const sameDay =
    startDate.getDate() === end.getDate() &&
    startDate.getMonth() === end.getMonth() &&
    startDate.getFullYear() === end.getFullYear();
  const sameMonthYear =
    startDate.getMonth() === end.getMonth() &&
    startDate.getFullYear() === end.getFullYear();
  const sameYear = startDate.getFullYear() === end.getFullYear();

  if (sameDay) return shortDateLabel(startDate);
  if (sameMonthYear)
    return `${startDate.getDate()}–${end.getDate()} ${MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()}`;
  if (sameYear)
    return `${startDate.getDate()} ${MONTH_NAMES[startDate.getMonth()]} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]} ${startDate.getFullYear()}`;
  return `${shortDateLabel(startDate)} – ${shortDateLabel(end)}`;
}
