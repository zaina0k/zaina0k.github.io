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

  const active = media[selectedIndex];

  return (
    <div className="group">
      {/* Main viewer */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {active.type === 'youtube' ? (
          <iframe
            key={selectedIndex}
            src={`https://www.youtube.com/embed/${active.src}?rel=0&modestbranding=1`}
            title={active.alt ?? 'Project video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <img
            src={active.src}
            alt={active.alt ?? ''}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
