import { useState, useMemo } from 'react';
import {
  type ProjectFilterItem,
  FAVOURITES,
  filterProjects,
  computeLiveCounts,
} from '../lib/filter';

export const PAGE_SIZE = 12;

interface Props {
  projects: ProjectFilterItem[];
  pageSize?: number;
}

function labelFor(group: string): string {
  return group
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProjectFilter({ projects, pageSize = PAGE_SIZE }: Props) {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);

  const allGroups = useMemo(() => {
    const s = new Set(projects.flatMap((p) => p.groups));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const fullTagList = useMemo(
    () => allGroups.filter((g) => !FAVOURITES.includes(g)),
    [allGroups],
  );

  const liveCounts = useMemo(
    () => computeLiveCounts(projects, selectedGroups),
    [projects, selectedGroups],
  );

  function toggle(group: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
    setCurrentPage(0);
  }

  const filtered = useMemo(
    () => filterProjects(projects, selectedGroups),
    [projects, selectedGroups],
  );

  function CheckboxRow({ group }: { group: string }) {
    const checked = selectedGroups.has(group);
    const count = liveCounts.get(group) ?? 0;
    return (
      <label className="flex items-center gap-2 cursor-pointer group/cb select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggle(group)}
          className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)] cursor-pointer"
        />
        <span className="text-sm text-[var(--color-text)] group-hover/cb:text-[var(--color-accent)] transition-colors">
          {labelFor(group)}
        </span>
        <span className="ml-auto text-xs text-[var(--color-text-muted)] tabular-nums">
          {count}
        </span>
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Filter panel */}
      <div className="border border-[var(--color-border)] rounded-lg p-5 flex flex-col gap-5">

        {/* Panel header + clear all */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
            Filter
          </p>
          {selectedGroups.size > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedGroups(new Set());
                setCurrentPage(0);
              }}
              className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Favourites */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3">
            Favourites
          </p>
          <div className="flex flex-col gap-2">
            {FAVOURITES.filter((f) => allGroups.includes(f)).map((group) => (
              <CheckboxRow key={group} group={group} />
            ))}
          </div>
        </div>

        {/* Full tag list — only shown if there are tags outside FAVOURITES */}
        {fullTagList.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3">
              More
            </p>
            <div className="flex flex-col gap-2">
              {fullTagList.map((group) => (
                <CheckboxRow key={group} group={group} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project grid — increment 10 */}
      <p className="text-[var(--color-text-muted)] text-sm">
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
