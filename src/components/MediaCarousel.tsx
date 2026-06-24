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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // All refs declared before any early return (rules-of-hooks)
  const savedScrollY = useRef(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zoomedRef = useRef(false);
  const carouselTouchStartX = useRef(0);
  const carouselTouchStartY = useRef(0);
  const lbTouchStartX = useRef(0);
  const lbTouchStartY = useRef(0);
  const lastTapTimeRef = useRef(0);

  const len = media?.length ?? 0;

  useEffect(() => {
    thumbRefs.current[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [selectedIndex]);

  const openLightbox = () => {
    savedScrollY.current = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${savedScrollY.current}px;width:100%;overflow:hidden`;
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    const top = Math.abs(parseInt(document.body.style.top || '0'));
    document.body.style.cssText = '';
    window.scrollTo(0, top);
    if (imgRef.current) {
      imgRef.current.style.transition = 'transform 0.2s ease';
      imgRef.current.style.transform = 'scale(1)';
      imgRef.current.style.transformOrigin = '50% 50%';
    }
    zoomedRef.current = false;
    setZoomed(false);
    setLightboxOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') { closeLightbox(); return; }
        return;
      }
      if (document.activeElement?.tagName === 'IFRAME') return;
      if (e.key === 'ArrowLeft') setSelectedIndex(i => n(i - 1, len));
      if (e.key === 'ArrowRight') setSelectedIndex(i => n(i + 1, len));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [len, lightboxOpen]);

  if (!media || media.length === 0) return null;

  const active = media[selectedIndex];
  const prev = () => setSelectedIndex(n(selectedIndex - 1, len));
  const next = () => setSelectedIndex(n(selectedIndex + 1, len));

  const handleWrapperClick = () => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const img = imgRef.current;
    if (!img) return;
    if (!zoomedRef.current) {
      img.style.transition = 'transform 0.2s ease';
      img.style.transform = 'scale(2)';
      zoomedRef.current = true;
      setZoomed(true);
    } else {
      img.style.transition = 'transform 0.2s ease';
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = '50% 50%';
      zoomedRef.current = false;
      setZoomed(false);
    }
  };

  const handleWrapperMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomedRef.current || !wrapperRef.current || !imgRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imgRef.current.style.transition = 'none';
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    carouselTouchStartX.current = e.touches[0].clientX;
    carouselTouchStartY.current = e.touches[0].clientY;
  };

  const handleCarouselTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - carouselTouchStartX.current;
    const dy = e.changedTouches[0].clientY - carouselTouchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    dx > 0 ? next() : prev();
  };

  return (
    <>
      <div className="group">
        {/* Main viewer */}
        <div
          className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
          onTouchStart={handleCarouselTouchStart}
          onTouchEnd={handleCarouselTouchEnd}
        >
          <div key={selectedIndex} style={{ animation: 'mc-fade-in 0.2s ease', width: '100%', height: '100%' }}>
            {active.type === 'youtube' ? (
              <iframe
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
                className="w-full h-full object-cover cursor-pointer"
                onClick={openLightbox}
              />
            )}
          </div>

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

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Backdrop — click outside image closes */}
          <div
            className="absolute inset-0"
            onClick={closeLightbox}
            aria-hidden="true"
          />
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="fixed top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {/* Lightbox prev/next arrows */}
          {len > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="fixed left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="fixed right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
          {/* Image at native aspect ratio */}
          <div className="relative z-10 p-4 flex flex-col items-center max-w-full overflow-auto" style={{ touchAction: 'manipulation' }}>
            <div
              ref={wrapperRef}
              onClick={handleWrapperClick}
              onMouseMove={handleWrapperMouseMove}
              className={`overflow-hidden ${zoomed ? 'cursor-crosshair' : '[@media(hover:hover)]:cursor-zoom-in'}`}
            >
              <img
                ref={imgRef}
                src={active.src}
                alt={active.alt ?? ''}
                className="max-w-full max-h-[90vh] object-contain select-none block"
              />
            </div>
            {active.caption && (
              <p className="text-white/70 text-sm mt-3 text-center max-w-xl">{active.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
