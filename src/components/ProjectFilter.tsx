import { useState, useMemo } from 'react';
import {
  type ProjectFilterItem,
  FAVOURITES,
  filterProjects,
  computeLiveCounts,
  paginateItems,
  pageCount,
} from '../lib/filter';
import ProjectCardItem from './ProjectCardItem';

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

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[var(--color-text-muted)] text-sm mb-2">
            No projects match the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGroups(new Set());
              setCurrentPage(0);
            }}
            className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Result count + page info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-muted)]">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </p>
            {pageCount(filtered.length, pageSize) > 1 && (
              <p className="text-sm text-[var(--color-text-muted)] tabular-nums">
                Page {currentPage + 1} of {pageCount(filtered.length, pageSize)}
              </p>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginateItems(filtered, currentPage, pageSize).map((project) => (
              <ProjectCardItem key={project.id} {...project} />
            ))}
          </div>

          {/* Pagination controls — only when more than one page */}
          {pageCount(filtered.length, pageSize) > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 text-sm rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: pageCount(filtered.length, pageSize) }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={[
                    'w-8 h-8 text-sm rounded border transition-colors',
                    i === currentPage
                      ? 'border-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
                  ].join(' ')}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pageCount(filtered.length, pageSize) - 1, p + 1),
                  )
                }
                disabled={currentPage === pageCount(filtered.length, pageSize) - 1}
                className="px-3 py-1.5 text-sm rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
