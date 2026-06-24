import { useState, useMemo, useEffect } from 'react';
import {
  type ProjectFilterItem,
  FAVOURITES,
  filterProjects,
  computeLiveCounts,
  paginateItems,
  pageCount,
} from '../lib/filter';
import ProjectCardItem from './ProjectCardItem';
import { UI_IMAGES } from '../lib/images';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsModalOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

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

  function clearAll() {
    setSelectedGroups(new Set());
    setCurrentPage(0);
  }

  const filtered = useMemo(
    () => filterProjects(projects, selectedGroups),
    [projects, selectedGroups],
  );

  const totalPages = pageCount(filtered.length, pageSize);

  function CheckboxRow({ group }: { group: string }) {
    const checked = selectedGroups.has(group);
    const count = liveCounts.get(group) ?? 0;
    const id = `filter-${group}`;
    return (
      <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer group/cb select-none">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={() => toggle(group)}
          aria-label={`Filter by ${labelFor(group)} (${count} project${count !== 1 ? 's' : ''})`}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={[
            'w-4 h-4 rounded shrink-0 border transition-all duration-150 flex items-center justify-center',
            checked
              ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
              : 'bg-transparent border-[var(--color-border)] group-hover/cb:border-[var(--color-accent)]',
          ].join(' ')}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm text-[var(--color-text)] group-hover/cb:text-[var(--color-accent)] transition-colors">
          {labelFor(group)}
        </span>
        <span aria-hidden="true" className="ml-auto text-xs text-[var(--color-text-muted)] tabular-nums w-5 text-right">
          {count}
        </span>
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Filter trigger bar ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filters
          {selectedGroups.size > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold leading-none">
              {selectedGroups.size}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {Array.from(selectedGroups).map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => toggle(group)}
            aria-label={`Remove filter: ${labelFor(group)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer"
          >
            {labelFor(group)}
            <svg aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 1l6 6M7 1l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ))}

        {/* Clear all — shown when 2+ filters active */}
        {selectedGroups.size > 1 && (
          <button
            type="button"
            onClick={clearAll}
            aria-label="Clear all filters"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Result count ── */}
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

      {/* ── Project grid ── */}
      {filtered.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <img src={UI_IMAGES.emptyState} alt="" aria-hidden="true" width={128} height={128} className="w-32 h-auto mx-auto mb-4 opacity-60" />
          <p className="text-[var(--color-text-muted)] text-sm mb-2">
            No projects match the selected filters.
          </p>
          <button
            type="button"
            onClick={clearAll}
            aria-label="Clear all filters"
            className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div aria-label="Projects list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginateItems(filtered, currentPage, pageSize).map((project) => (
              <ProjectCardItem key={project.id} {...project} />
            ))}
          </div>

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

      {/* ── Filter modal ── */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          {/* Panel: bottom sheet on mobile, centred dialog on sm+ */}
          <div className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6 pointer-events-none">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-modal-title"
              className="pointer-events-auto w-full sm:max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[70vh]"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0">
                <h2
                  id="filter-modal-title"
                  className="text-sm font-semibold tracking-widest uppercase text-[var(--color-text-muted)]"
                >
                  Filter Projects
                </h2>
                <div className="flex items-center gap-3">
                  {selectedGroups.size > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close filter panel"
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal body — scrollable */}
              <div
                role="search"
                aria-label="Filter projects"
                className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5"
              >
                {/* Favourites */}
                <div>
                  <p
                    id="filter-favourites-label"
                    className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3"
                  >
                    Favourites
                  </p>
                  <div role="group" aria-labelledby="filter-favourites-label" className="flex flex-col gap-3">
                    {FAVOURITES.filter((f) => allGroups.includes(f)).map((group) => (
                      <CheckboxRow key={group} group={group} />
                    ))}
                  </div>
                </div>

                {/* Full tag list */}
                {fullTagList.length > 0 && (
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <p
                      id="filter-more-label"
                      className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-3"
                    >
                      More
                    </p>
                    <div role="group" aria-labelledby="filter-more-label" className="flex flex-col gap-3">
                      {fullTagList.map((group) => (
                        <CheckboxRow key={group} group={group} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer — close / confirm */}
              <div className="px-5 py-4 border-t border-[var(--color-border)] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 text-sm font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Show {filtered.length} project{filtered.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
