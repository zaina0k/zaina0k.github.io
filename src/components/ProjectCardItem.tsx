import type { ProjectFilterItem } from '../lib/filter';
import { UI_IMAGES } from '../lib/images';

type Props = Pick<
  ProjectFilterItem,
  'title' | 'startYear' | 'summary' | 'tags' | 'status' | 'href' | 'thumbnail'
>;

const STATUS_LABELS: Record<ProjectFilterItem['status'], string> = {
  shipped: 'Shipped',
  'in-progress': 'In Progress',
  planned: 'Planned',
  archived: 'Archived',
};

export default function ProjectCardItem({
  title,
  startYear,
  summary,
  tags,
  status,
  href,
  thumbnail,
}: Props) {
  const thumbnailAlt = `Screenshot of ${title}`;

  return (
    <a
      href={href}
      className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)] hover:scale-[1.02] transition-all duration-200 overflow-hidden"
    >
      {/* Image area with title overlay */}
      <div className="relative aspect-video w-full overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail.src}
            alt={thumbnailAlt}
            width={thumbnail.width}
            height={thumbnail.height}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={UI_IMAGES.inProgressThumbnail} alt="Project in progress" width={800} height={450} loading="lazy" className="w-full h-full object-cover" />
        )}

        {/* Accent banner behind title */}
        <div className="absolute inset-x-0 bottom-0 bg-[var(--color-accent)]/90 px-4 py-3 z-10">
          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-white/80 group-focus-visible:text-white/80 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Below-image strip */}
      <div className="p-4">
        {/* Year + status badge */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[var(--color-text-muted)] tracking-wide">
            {startYear}
          </p>
          <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-[var(--color-text)] leading-relaxed mb-4">
          {summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
