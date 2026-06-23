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
