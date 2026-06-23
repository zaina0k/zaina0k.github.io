import { useState, useEffect, useRef } from 'react';

const n = (i: number, len: number) => ((i % len) + len) % len;

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

  const len = media.length;
  const active = media[selectedIndex];
  const prev = () => setSelectedIndex(n(selectedIndex - 1, len));
  const next = () => setSelectedIndex(n(selectedIndex + 1, len));

  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    thumbRefs.current[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [selectedIndex]);

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

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 text-white opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 text-white opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      {/* Filmstrip */}
      <div className="flex overflow-x-auto gap-2 mt-2 pb-1">
        {media.map((item, i) => (
          <button
            key={i}
            ref={el => { thumbRefs.current[i] = el; }}
            onClick={() => setSelectedIndex(i)}
            className={`relative shrink-0 w-24 h-14 rounded overflow-hidden cursor-pointer focus:outline-none ring-offset-1 ${i === selectedIndex ? 'ring-2 ring-accent' : ''}`}
            aria-label={item.alt ?? `Media ${i + 1}`}
          >
            <img
              src={
                item.type === 'youtube'
                  ? `https://img.youtube.com/vi/${item.src}/mqdefault.jpg`
                  : item.src
              }
              alt={item.alt ?? ''}
              className="w-full h-full object-cover"
            />
            {item.type === 'youtube' && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="drop-shadow"><polygon points="5,3 19,12 5,21"/></svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
