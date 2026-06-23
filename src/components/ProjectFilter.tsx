import { useState } from 'react';
import type { ProjectFilterItem } from '../lib/filter';

export const PAGE_SIZE = 12;

interface Props {
  projects: ProjectFilterItem[];
  pageSize?: number;
}

export default function ProjectFilter({ projects, pageSize = PAGE_SIZE }: Props) {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      {/* filter panel — increment 7 */}
      {/* project grid — increment 10 */}
      <p className="text-[var(--color-text-muted)] text-sm">
        {projects.length} project{projects.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
