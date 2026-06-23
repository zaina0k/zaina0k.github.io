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
  const [isFilterOpen, setIsFilterOpen] = useState(true);

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
    const id = `filter-${group}`;
    return (
      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer group/cb select-none"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={() => toggle(group)}
          aria-label={`Filter by ${labelFor(group)} (${count} project${count !== 1 ? 's' : ''})`}
          className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)] cursor-pointer"
        />
        <span className="text-sm text-[var(--color-text)] group-hover/cb:text-[var(--color-accent)] transition-colors">
          {labelFor(group)}
        </span>
        <span
          aria-hidden="true"
          className="ml-auto text-xs text-[var(--color-text-muted)] tabular-nums"
        >
          {count}
        </span>
      </label>
    );
  }

  const totalPages = pageCount(filtered.length, pageSize);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-8 items-start">

      {/* Filter panel — left column */}
      <div
        role="search"
        aria-label="Filter projects"
        className="border border-[var(--color-border)] rounded-lg p-5 flex flex-col gap-5 md:sticky md:top-8"
      >

        {/* Panel header — toggle button + clear all */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-expanded={isFilterOpen}
            aria-controls="filter-body"
            onClick={() => setIsFilterOpen((v) => !v)}
            className="flex items-center gap-2 flex-1 cursor-pointer group/toggle"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] group-hover/toggle:text-[var(--color-accent)] transition-colors">
              Filter
            </span>
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`ml-auto text-[var(--color-text-muted)] transition-transform duration-200 group-hover/toggle:text-[var(--color-accent)] ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {selectedGroups.size > 0 && (
            <button
              type="button"
              aria-label="Clear all filters"
              onClick={() => {
                setSelectedGroups(new Set());
                setCurrentPage(0);
              }}
              className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer shrink-0"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Collapsible body */}
        {isFilterOpen && (
          <div id="filter-body" className="flex flex-col gap-5">

            {/* Favourites */}
            <div>
              <p
                id="filter-favourites-label"
                className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3"
              >
                Favourites
              </p>
              <div role="group" aria-labelledby="filter-favourites-label" className="flex flex-col gap-2">
                {FAVOURITES.filter((f) => allGroups.includes(f)).map((group) => (
                  <CheckboxRow key={group} group={group} />
                ))}
              </div>
            </div>

            {/* Full tag list — only shown if there are tags outside FAVOURITES */}
            {fullTagList.length > 0 && (
              <div className="border-t border-[var(--color-border)] pt-4">
                <p
                  id="filter-more-label"
                  className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3"
                >
                  More
                </p>
                <div role="group" aria-labelledby="filter-more-label" className="flex flex-col gap-2">
                  {fullTagList.map((group) => (
                    <CheckboxRow key={group} group={group} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right column — chips + grid + pagination */}
      <div className="flex flex-col gap-6">

        {/* Active filter chips — only when panel is closed and filters are active */}
        {!isFilterOpen && selectedGroups.size > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {Array.from(selectedGroups).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => toggle(group)}
                aria-label={`Remove filter: ${labelFor(group)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer"
              >
                {labelFor(group)}
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            ))}
            {selectedGroups.size > 1 && (
              <button
                type="button"
                aria-label="Clear all filters"
                onClick={() => { setSelectedGroups(new Set()); setCurrentPage(0); }}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
        )}

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <p className="text-[var(--color-text-muted)] text-sm mb-2">
            No projects match the selected filters.
          </p>
          <button
            type="button"
            aria-label="Clear all filters"
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
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="flex items-center justify-between"
          >
            <p className="text-sm text-[var(--color-text-muted)]">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-[var(--color-text-muted)] tabular-nums">
                Page {currentPage + 1} of {totalPages}
              </p>
            )}
          </div>

          {/* Cards grid */}
          <div
            aria-label="Projects list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginateItems(filtered, currentPage, pageSize).map((project) => (
              <ProjectCardItem key={project.id} {...project} />
            ))}
          </div>

          {/* Pagination controls — only when more than one page */}
          {totalPages > 1 && (
            <nav aria-label="Projects pagination" className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
                className="px-3 py-1.5 text-sm rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === currentPage ? 'page' : undefined}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
                className="px-3 py-1.5 text-sm rounded border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}

      </div>{/* end right column */}
    </div>
  );
}
