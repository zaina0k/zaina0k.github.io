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

const STATUS_STYLES: Record<
  ProjectFilterItem['status'],
  { bg: string; color: string; border: string }
> = {
  shipped: {
    bg: 'var(--health-green-bg)',
    color: 'var(--health-green)',
    border: 'var(--health-green-border)',
  },
  'in-progress': {
    bg: 'var(--health-amber-bg)',
    color: 'var(--health-amber)',
    border: 'var(--health-amber-border)',
  },
  planned: {
    bg: 'var(--health-blue-bg)',
    color: 'var(--health-blue)',
    border: 'var(--health-blue-border)',
  },
  archived: {
    bg: 'var(--health-gray-bg)',
    color: 'var(--health-gray)',
    border: 'var(--health-gray-border)',
  },
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
  const statusStyle = STATUS_STYLES[status];

  return (
    <a
      href={href}
      className="group block rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-focus)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Image area with title overlay */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-[var(--border-color)]">
        {thumbnail ? (
          <img
            src={thumbnail.src}
            alt={thumbnailAlt}
            width={thumbnail.width}
            height={thumbnail.height}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <img src={UI_IMAGES.inProgressThumbnail} alt="Project in progress" width={800} height={450} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        )}

        {/* Dark Blue / Indigo gradient banner behind title */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 py-3 z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(30, 30, 46, 0.94) 0%, rgba(45, 43, 85, 0.94) 50%, rgba(79, 70, 229, 0.94) 100%)',
          }}
        >
          <h3 className="text-[14px] font-bold tracking-[-0.01em] text-white leading-snug group-hover:text-white/90 group-focus-visible:text-white/90 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Below-image card body (Template 5.2 .card-body) */}
      <div className="p-4">
        {/* Year + status badge (Template 5.5 .badge) */}
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[12px] font-semibold text-[var(--text-muted)] tracking-wide">
            {startYear}
          </p>
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-[20px] text-[11px] font-semibold"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Summary */}
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">
          {summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-[20px] text-[11px] font-semibold"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--border-focus)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
