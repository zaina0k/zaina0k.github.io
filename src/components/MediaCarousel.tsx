import { useState } from 'react';

export type MediaItem = {
  type: 'image' | 'youtube';
  src: string;
  alt?: string;
  caption?: string;
};

type Props = {
  media: MediaItem[];
};

export default function MediaCarousel({ media }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!media || media.length === 0) return null;

  return (
    <div>
      {/* Carousel renders here */}
    </div>
  );
}
