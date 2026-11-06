import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const NEXT: Record<Theme, Theme> = { system: 'dark', dark: 'light', light: 'system' };
const LABEL: Record<Theme, string> = { light: 'Light', dark: 'Dark', system: 'System' };

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      root.classList.toggle('dark', dark);
    };
    apply();
    if (theme === 'system') {
      localStorage.removeItem('theme');
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const next = NEXT[theme];

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[theme]}`}
      className="rounded-[6px] p-2 text-white/80 bg-white/10 border border-white/20 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-150 cursor-pointer"
    >
      {theme === 'light' && (
        /* Sun icon */
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
      {theme === 'dark' && (
        /* Moon icon */
        <svg {...svgProps}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
      {theme === 'system' && (
        /* Monitor icon */
        <svg {...svgProps}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )}
    </button>
  );
}
