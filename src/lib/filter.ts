export interface ProcessedImage {
  src: string;
  width: number;
  height: number;
  format: string;
}

export interface ProjectFilterItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  groups: string[];
  sortOrder: number;
  startYear: number;
  status: 'planned' | 'in-progress' | 'shipped' | 'archived';
  href: string;
  thumbnail: ProcessedImage | null;
}

// Curated tags surfaced prominently at the top of the filter panel.
// Order determines display order in the Favourites section.
export const FAVOURITES: string[] = [
  'university',
  'personal',
  'hackathon',
  'python',
  'game-dev',
  'web',
];

/** Returns projects that match ANY of the selected groups (OR logic).
 *  An empty selectedGroups set returns all projects unchanged. */
export function filterProjects(
  items: ProjectFilterItem[],
  selectedGroups: Set<string>,
): ProjectFilterItem[] {
  if (selectedGroups.size === 0) return items;
  return items.filter((item) =>
    item.groups.some((g) => selectedGroups.has(g)),
  );
}

/** For each group tag across all items, returns how many projects would
 *  be in the result if that tag were added to the current selection.
 *  Count for an already-selected tag reflects the full OR match set. */
export function computeLiveCounts(
  items: ProjectFilterItem[],
  selectedGroups: Set<string>,
): Map<string, number> {
  const counts = new Map<string, number>();
  const allGroups = new Set(items.flatMap((i) => i.groups));
  for (const group of allGroups) {
    const hypothetical = new Set(selectedGroups).add(group);
    counts.set(group, filterProjects(items, hypothetical).length);
  }
  return counts;
}

/** Returns a single page slice. pageIndex is 0-based. */
export function paginateItems<T>(
  items: T[],
  pageIndex: number,
  pageSize: number,
): T[] {
  const start = pageIndex * pageSize;
  return items.slice(start, start + pageSize);
}

/** Total page count given a list length and page size. */
export function pageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
