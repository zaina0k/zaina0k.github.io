# HRQuickScope — Complete Style Guide

> Extracted from [`style.css`](file:///Users/ubaidnisar/Library/CloudStorage/OneDrive-DGPrivateHireLtd/Projects/HRQuickScope/public/css/style.css) and all template files.  
> Copy-paste ready for any new project.

---

## 1. Foundation

### Font
```
Inter — weights 300 · 400 · 500 · 600 · 700 · 800
```
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
```
**Fallback stack:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

### Base HTML
```css
html  { font-size: 14px; scroll-behavior: smooth; }
body  { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: var(--bg-primary); color: var(--text-primary);
        line-height: 1.6; -webkit-font-smoothing: antialiased; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
```

### Icon Library
```
Lucide Icons — loaded via unpkg CDN
```
```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```
Usage: `<i data-lucide="icon-name" style="width:16px;height:16px;"></i>`

---

## 2. Design Tokens (CSS Custom Properties)

### 2.1 Brand Colours

| Token | Value | Swatch | Usage |
|---|---|---|---|
| `--primary` | `#4f46e5` | 🟪 Indigo 600 | Primary actions, active states |
| `--primary-hover` | `#4338ca` | 🟪 Indigo 700 | Hover state for primary |
| `--primary-light` | `rgba(79,70,229, 0.08)` | — | Focus rings, tinted backgrounds |
| `--primary-glow` | `rgba(79,70,229, 0.18)` | — | Glow shadows |
| `--accent-primary` | `#4f46e5` | 🟪 | Alias of `--primary` |
| `--accent-primary-glow` | `rgba(79,70,229, 0.18)` | — | Alias of `--primary-glow` |
| `--accent-secondary` | `#0891b2` | 🩵 Cyan 600 | Secondary accent, link hover |
| `--accent-cyan` | `#0891b2` | 🩵 | Alias of `--accent-secondary` |

### 2.2 Surfaces

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#f4f6f9` | Page background |
| `--bg-secondary` | `#ffffff` | Modal backgrounds, focused inputs |
| `--bg-tertiary` | `#f0f2f5` | Table header, subtle alt-bg |
| `--bg-card` | `#ffffff` | Card / panel backgrounds |
| `--bg-glass` | `rgba(255,255,255, 0.85)` | Glassmorphism overlays |
| `--bg-hover` | `#f7f8fa` | Row / item hover |
| `--bg-input` | `#f8f9fb` | Input resting state |

### 2.3 Text

| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#1e1e2e` | Body text, headings |
| `--text-secondary` | `#6b7280` | Labels, descriptions |
| `--text-muted` | `#9ca3af` | Captions, meta info |
| `--text-inverse` | `#ffffff` | Text on dark surfaces |

### 2.4 Borders

| Token | Value | Usage |
|---|---|---|
| `--border-color` | `#e5e7eb` | Card/table/input borders |
| `--border-focus` | `rgba(79,70,229, 0.45)` | Focus ring border |

### 2.5 Status / Health

| Colour | Solid | Background | Border |
|---|---|---|---|
| **Green** | `#059669` | `rgba(5,150,105, 0.08)` | `rgba(5,150,105, 0.2)` |
| **Amber** | `#d97706` | `rgba(217,119,6, 0.08)` | `rgba(217,119,6, 0.2)` |
| **Red** | `#e11d48` | `rgba(225,29,72, 0.06)` | `rgba(225,29,72, 0.2)` |
| **Blue** | `#3b82f6` | `rgba(59,130,246, 0.1)` | `rgba(59,130,246, 0.2)` |
| **Gray** | `#6b7280` | `rgba(107,114,128, 0.1)` | `rgba(107,114,128, 0.2)` |

CSS variable names follow `--health-{color}`, `--health-{color}-bg`, `--health-{color}-border`.

### 2.6 Sizing & Spacing

| Token | Value |
|---|---|
| `--sidebar-width` | `260px` |
| `--header-height` | `64px` |

### 2.7 Border Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Buttons, inputs, small pills |
| `--radius-md` | `10px` | Cards, nav items, KPI cards |
| `--radius-lg` | `14px` | Login card, brand icon |
| `--radius-xl` | `20px` | Full-pill badges, large cards |

### 2.8 Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)` | Cards, buttons resting |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.06)` | Cards on hover |
| `--shadow-lg` | `0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)` | Login card, modals |
| `--shadow-glow` | `0 0 16px var(--primary-glow)` | Primary button hover |

### 2.9 Transitions

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `150ms ease` | Hover states, focus |
| `--transition-base` | `250ms ease` | Sidebar slide, general |
| `--transition-slow` | `400ms ease` | Page fade-in |

---

## 3. Complete CSS Variables Block

Copy this entire `:root` block into your new project:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
    /* Brand Colors */
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --primary-light: rgba(79, 70, 229, 0.08);
    --primary-glow: rgba(79, 70, 229, 0.18);
    --accent-primary: #4f46e5;
    --accent-primary-glow: rgba(79, 70, 229, 0.18);
    --accent-secondary: #0891b2;
    --accent-cyan: #0891b2;

    /* Surfaces */
    --bg-primary: #f4f6f9;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f0f2f5;
    --bg-card: #ffffff;
    --bg-glass: rgba(255,255,255,0.85);
    --bg-hover: #f7f8fa;
    --bg-input: #f8f9fb;

    /* Text */
    --text-primary: #1e1e2e;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --text-inverse: #ffffff;

    /* Borders */
    --border-color: #e5e7eb;
    --border-focus: rgba(79, 70, 229, 0.45);

    /* Health/Status */
    --health-green: #059669;
    --health-green-bg: rgba(5,150,105,0.08);
    --health-green-border: rgba(5,150,105,0.2);
    --health-amber: #d97706;
    --health-amber-bg: rgba(217,119,6,0.08);
    --health-amber-border: rgba(217,119,6,0.2);
    --health-red: #e11d48;
    --health-red-bg: rgba(225,29,72,0.06);
    --health-red-border: rgba(225,29,72,0.2);

    /* Sidebar */
    --sidebar-width: 260px;
    --sidebar-bg: #1e1e2e;
    --sidebar-text: #cbd5e1;
    --sidebar-text-muted: rgba(255,255,255,0.4);
    --sidebar-hover: rgba(255,255,255,0.06);
    --sidebar-active: rgba(79, 70, 229, 0.2);
    --sidebar-active-text: #ffffff;

    --header-height: 64px;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 20px;

    --shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04);
    --shadow-glow: 0 0 16px var(--primary-glow);

    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 400ms ease;
}
```

---

## 4. Layout Architecture

### 4.1 App Shell

```
┌──────────────────────────────────────────────────────┐
│ .app-layout  (display: flex)                         │
│ ┌──────────┐ ┌──────────────────────────────────────┐│
│ │ .sidebar  │ │ .main-content                       ││
│ │ (fixed)   │ │ ┌──────────────────────────────────┐││
│ │ 260px     │ │ │ .top-bar (sticky)                │││
│ │           │ │ ├──────────────────────────────────┤││
│ │           │ │ │ .page-content (padding: 16 20px) │││
│ │           │ │ └──────────────────────────────────┘││
│ └──────────┘ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

```css
.app-layout  { display: flex; min-height: 100vh; }
.main-content { flex: 1; margin-left: var(--sidebar-width); min-height: 100vh; }
.page-content { padding: 16px 20px; }
```

### 4.2 Sidebar

**Dark panel** — `#1e1e2e` background, fixed position, full-height.

```css
.sidebar {
    width: var(--sidebar-width);        /* 260px */
    background: var(--sidebar-bg);      /* #1e1e2e */
    border-right: 1px solid rgba(255,255,255,0.08);
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
    display: flex; flex-direction: column;
    transition: transform var(--transition-base);
}
```

#### Brand Header
```css
.sidebar-brand {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(180deg, rgba(79,70,229,0.1) 0%, transparent 100%);
    display: flex; align-items: center; gap: 10px;
}
```
- **Brand icon:** `36×36`, `border-radius: 10px`, gradient `linear-gradient(135deg, --accent-primary, --accent-cyan)`
- **Brand name:** `16px`, weight `700`, white, `letter-spacing: -0.02em`
- **Brand sub:** `11px`, `--sidebar-text-muted`, weight `400`

#### Navigation Items
```css
.nav-section-title {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--sidebar-text-muted);
    padding: 0 10px; margin-bottom: 4px;
}
.nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: var(--radius-md);
    color: var(--sidebar-text); font-weight: 500; font-size: 13px;
    transition: all var(--transition-fast);
    cursor: pointer; margin-bottom: 2px;
}
.nav-item:hover   { background: var(--sidebar-hover); color: var(--sidebar-active-text); }
.nav-item.active  { background: var(--sidebar-active); color: var(--sidebar-active-text); font-weight: 600; }
```
- **Icons:** `18×18`, `opacity: 0.8` → `1` on hover

#### Sidebar Footer (User)
```css
.sidebar-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
.user-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
    font-weight: 700; font-size: 14px; color: white;
}
.user-name { font-size: 14px; font-weight: 600; color: #ffffff; }
.user-role { font-size: 12px; color: var(--sidebar-text-muted); text-transform: capitalize; }
```

### 4.3 Top Bar

**Gradient banner** — sticky at top, `z-index: 50`.

```css
.top-bar {
    padding: 14px 24px;
    background: linear-gradient(135deg, #1e1e2e 0%, #2d2b55 50%, #4f46e5 100%);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 2px 12px rgba(30,30,46,0.15);
}
```

- **Page title:** `17px`, weight `700`, white, `letter-spacing: -0.02em`
- **Page subtitle:** `11px`, `rgba(255,255,255,0.6)`
- **Sync status:** `12px`, `rgba(255,255,255,0.85)`, pill with `rgba(255,255,255,0.1)` background
- **Sync dot:** `7×7`, `#10b981`, animated pulse

### 4.4 Responsive

```css
@media (max-width: 1024px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0; }
}
```

---

## 5. Components

### 5.1 Buttons

```css
.btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; border: none;
    cursor: pointer; transition: all var(--transition-fast);
    font-family: 'Inter', sans-serif;
}
```

| Variant | Styles |
|---|---|
| `.btn-primary` | `bg: --primary`, white text, `shadow-sm` → hover: `--primary-hover`, `translateY(-1px)`, `shadow-glow` |
| `.btn-secondary` | `bg: --bg-card`, `--text-primary`, `1px solid --border-color`, `shadow-sm` → hover: `--bg-hover`, `border-focus` |
| `.btn-sm` | `padding: 5px 12px`, `font-size: 12px` |
| `.btn-refresh` | `bg: rgba(255,255,255,0.1)`, `border: rgba(255,255,255,0.2)`, white text → hover: `0.2` / `0.3` opacity |

### 5.2 Cards

```css
.card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    margin-bottom: 12px; overflow: hidden;
}
.card-header {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-color);
    display: flex; align-items: center; justify-content: space-between;
}
.card-title { font-size: 13px; font-weight: 700; letter-spacing: -0.01em; }
.card-body { padding: 12px 14px; }
.card-body.no-padding { padding: 0; }
```

### 5.3 KPI Cards

```css
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 16px; }

.kpi-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    box-shadow: var(--shadow-sm);
    border-top: 2px solid transparent;     /* ← colour accent at top */
    transition: all var(--transition-base);
}
.kpi-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
```

**Health variants:**
- `.kpi-card.health-green` → `border-top-color: --health-green`
- `.kpi-card.health-amber` → `border-top-color: --health-amber`
- `.kpi-card.health-red`   → `border-top-color: --health-red`

**Internal structure:**
```
┌─────────────────────────────────┐
│ [icon 28×28]        [kpi-label] │  ← .kpi-header
│                                 │
│  22px / 800wt value             │  ← .kpi-value
│  11px muted subtitle            │  ← .kpi-subtitle
└─────────────────────────────────┘
```

| Element | Size | Weight | Colour |
|---|---|---|---|
| `.kpi-label` | `10px` | `600` | `--text-secondary`, uppercase, `letter-spacing: 0.05em` |
| `.kpi-value` | `22px` | `800` | Contextual, `letter-spacing: -0.02em` |
| `.kpi-subtitle` | `11px` | `500` | `--text-muted` |
| `.kpi-icon` | `28×28` | — | Rounded `--radius-sm`, health-tinted bg |

#### Alternate KPI Pattern (Dashboard Inline)

Used on the main dashboard with a **horizontal icon+text** layout:

```css
/* Inline style pattern from dashboard */
.kpi-inline {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 12px;
    display: flex; gap: 10px; align-items: flex-start;
    box-shadow: var(--shadow-sm);
}
.kpi-inline-icon {
    width: 32px; height: 32px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.kpi-inline-label {
    font-size: 10px; color: var(--text-secondary);
    font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; margin-bottom: 1px;
}
.kpi-inline-value {
    font-size: 18px; font-weight: 800;
    line-height: 1.1; letter-spacing: -0.02em;
}
.kpi-inline-meta {
    font-size: 10px; color: var(--text-muted);
    font-weight: 500; margin-top: 2px;
}
```

### 5.4 Data Tables

```css
.data-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }

.data-table th {
    background: var(--bg-tertiary); color: var(--text-secondary);
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 6px 10px;
    border-bottom: 1px solid var(--border-color);
}
.data-table td {
    padding: 6px 10px;
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
}
.data-table tbody tr { transition: background var(--transition-fast); }
.data-table tbody tr:nth-child(even) { background: rgba(0,0,0,0.015); }
.data-table tbody tr:hover { background: var(--bg-tertiary); }
.clickable-row { cursor: pointer; }

/* Row status highlights */
.data-table tbody tr.row-red   { background: var(--health-red-bg)   !important; }
.data-table tbody tr.row-amber { background: var(--health-amber-bg) !important; }
```

### 5.5 Badges

```css
.badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px;
    border-radius: var(--radius-xl);   /* 20px — full-pill */
    font-size: 11px; font-weight: 600; white-space: nowrap;
}
```

| Variant | Background | Text | Border |
|---|---|---|---|
| `.badge-green` | `rgba(5,150,105, 0.08)` | `#059669` | `rgba(5,150,105, 0.2)` |
| `.badge-amber` | `rgba(217,119,6, 0.08)` | `#d97706` | `rgba(217,119,6, 0.2)` |
| `.badge-red` | `rgba(225,29,72, 0.06)` | `#e11d48` | `rgba(225,29,72, 0.2)` |
| `.badge-blue` | `rgba(59,130,246, 0.1)` | `#3b82f6` | `rgba(59,130,246, 0.2)` |
| `.badge-gray` | `rgba(107,114,128, 0.1)` | `#6b7280` | `rgba(107,114,128, 0.2)` |

### 5.6 Forms & Inputs

```css
.form-group { margin-bottom: 14px; }
.form-label {
    display: block; font-size: 12px; font-weight: 600;
    color: var(--text-primary); margin-bottom: 4px;
}
.form-input, .form-select {
    width: 100%; padding: 8px 12px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary); font-size: 13px;
    font-family: 'Inter', sans-serif;
    transition: all var(--transition-fast);
}
.form-input:focus, .form-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
    background: var(--bg-secondary);
}
.form-input::placeholder { color: var(--text-muted); }
```

**Compact variant (reconciliation):**
```css
.recon-input {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px; font-size: 12px;
    background: var(--bg-secondary);
    font-family: 'Inter', sans-serif;
}
```

### 5.7 Filter Bar

```css
.filters-bar {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-bottom: 16px; padding: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}
.filter-group {
    display: flex; flex-direction: column;
    gap: 4px; min-width: 140px;
}
.filter-group label {
    font-size: 11px; font-weight: 600; color: var(--text-secondary);
}
.filter-group select, .filter-group input {
    padding: 6px 10px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 13px;
}
```

### 5.8 Flash Messages / Alerts

```css
.flash {
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    margin-bottom: 12px;
    font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
}
.flash-success {
    background: var(--health-green-bg); color: var(--health-green);
    border: 1px solid var(--health-green-border);
}
.flash-error {
    background: var(--health-red-bg); color: var(--health-red);
    border: 1px solid var(--health-red-border);
}
```

### 5.9 Slide-Over Modal

```css
.slide-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(17,24,39, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1000;
    opacity: 0; visibility: hidden;
    transition: all var(--transition-base);
}
.slide-modal-overlay.open { opacity: 1; visibility: visible; }

.slide-modal {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 480px;
    background: var(--bg-secondary);
    box-shadow: -12px 0 40px rgba(0,0,0,0.1);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column;
}
.slide-modal.open { transform: translateX(0); }

.slide-modal-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    display: flex; justify-content: space-between; align-items: center;
}
.slide-modal-body { padding: 32px; flex: 1; overflow-y: auto; }
```

### 5.10 Charts

```css
.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 16px; margin-bottom: 16px;
}
.chart-container { position: relative; height: 260px; padding: 4px; }
```

Charts use **Chart.js v4**.

### 5.11 Empty State

```css
.empty-state {
    text-align: center; padding: 40px 16px;
    color: var(--text-muted);
}
.empty-state svg { margin-bottom: 12px; opacity: 0.4; width: 36px; height: 36px; }
.empty-state h3 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.empty-state p { font-size: 12px; color: var(--text-secondary); }
```

### 5.12 Spinner

```css
.spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### 5.13 Login Page

```css
.login-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-primary); padding: 24px;
    position: relative; overflow: hidden;
}
/* Decorative radial blobs */
.login-page::before {
    content: ''; position: absolute;
    width: 800px; height: 800px; border-radius: 50%;
    background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
    top: -300px; right: -200px;
}
.login-page::after {
    content: ''; position: absolute;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%);
    bottom: -200px; left: -150px;
}
.login-card {
    width: 100%; max-width: 440px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);       /* 20px */
    padding: 48px 40px;
    box-shadow: var(--shadow-lg);
    position: relative; z-index: 1;
}
.login-brand { text-align: center; margin-bottom: 36px; }
.login-brand .brand-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
    border-radius: var(--radius-lg);
    font-weight: 800; font-size: 24px; color: white;
    margin: 0 auto 20px;
    box-shadow: 0 8px 24px var(--primary-glow);
}
.login-brand h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; }
.login-brand p { font-size: 15px; color: var(--text-secondary); }
.login-card .btn-primary { width: 100%; padding: 14px; font-size: 15px; justify-content: center; margin-top: 12px; }
```

---

## 6. Animations

### 6.1 Pulse (Sync Dot)
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.5; }
}
/* Usage: animation: pulse 2s infinite; */
```

### 6.2 Spin (Loader)
```css
@keyframes spin {
    to { transform: rotate(360deg); }
}
/* Usage: animation: spin 0.6s linear infinite; */
```

### 6.3 Page Load Fade-In
```css
/* In <head>: */
body { opacity: 0; transition: opacity 0.15s ease; }
.body-ready { opacity: 1; }
/* Triggered in footer JS: document.body.classList.add('body-ready'); */
```

### 6.4 Hover Micro-Interactions

| Element | Effect |
|---|---|
| `.btn-primary:hover` | `translateY(-1px)` + glow shadow |
| `.kpi-card:hover` | `translateY(-1px)` + `shadow-md` |
| `.nav-item:hover` | Background + text colour shift |
| `.data-table tr:hover` | Background `--bg-tertiary` |
| `.slide-modal.open` | `translateX(100% → 0)`, `cubic-bezier(0.4, 0, 0.2, 1)` |

---

## 7. Typography Scale

| Context | Size | Weight | Additional |
|---|---|---|---|
| Page title (top bar) | `17px` | `700` | White, `letter-spacing: -0.02em` |
| Card title | `13px` | `700` | `--text-primary`, `letter-spacing: -0.01em` |
| KPI value | `22px` | `800` | `letter-spacing: -0.02em` |
| KPI value (inline) | `18px` | `800` | `letter-spacing: -0.02em` |
| KPI label | `10px` | `600` | Uppercase, `letter-spacing: 0.05em` |
| Nav section title | `10px` | `700` | Uppercase, `letter-spacing: 0.05em` |
| Nav item | `13px` | `500` (active: `600`) | — |
| Body / table cell | `12px` | `400` | — |
| Table header | `10px` | `700` | Uppercase, `letter-spacing: 0.05em` |
| Badge | `11px` | `600` | — |
| Form label | `12px` | `600` | — |
| Form input | `13px` | `400` | — |
| Login h1 | `24px` | `800` | `letter-spacing: -0.03em` |
| Login subtitle | `15px` | `400` | `--text-secondary` |
| Flash message | `13px` | `500` | — |
| Empty state h3 | `15px` | `600` | — |
| Empty state p | `12px` | `400` | `--text-secondary` |

---

## 8. Grid / Layout Patterns

| Pattern | CSS |
|---|---|
| **KPI row** | `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;` |
| **KPI 4-col fixed** | `grid-template-columns: repeat(4, 1fr); gap: 10px;` |
| **Charts 2:1** | `grid-template-columns: 2fr 1fr; gap: 12px;` |
| **Charts auto** | `grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px;` |
| **Modal stats 2-col** | `grid-template-columns: 1fr 1fr; gap: 12px;` |
| **Sidebar + content** | Sidebar `position: fixed`, content `margin-left: var(--sidebar-width)` |

---

## 9. Key Gradients

| Where | Gradient |
|---|---|
| Brand icon / avatar | `linear-gradient(135deg, #4f46e5, #0891b2)` |
| Top bar | `linear-gradient(135deg, #1e1e2e 0%, #2d2b55 50%, #4f46e5 100%)` |
| Sidebar brand area | `linear-gradient(180deg, rgba(79,70,229,0.1) 0%, transparent 100%)` |
| Login blob (primary) | `radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)` |
| Login blob (cyan) | `radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)` |

---

## 10. External Dependencies

| Dependency | Version | CDN |
|---|---|---|
| **Inter** (font) | Variable | `fonts.googleapis.com` |
| **Lucide Icons** | Latest | `unpkg.com/lucide@latest` |
| **Chart.js** | v4 | `cdn.jsdelivr.net/npm/chart.js@4` |

---

## 11. Quick-Start Template

Copy this into your new project's `index.html` to get the full shell running:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="stylesheet" href="/css/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>body{opacity:0;transition:opacity .15s ease}.body-ready{opacity:1}</style>
</head>
<body>
<div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-icon">AB</div>
            <div>
                <div class="brand-name">App Name</div>
                <div class="brand-sub">Subtitle</div>
            </div>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-section">
                <div class="nav-section-title">Main</div>
                <a href="#" class="nav-item active">
                    <i data-lucide="layout-dashboard" class="nav-icon"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="nav-item">
                    <i data-lucide="users" class="nav-icon"></i>
                    <span>People</span>
                </a>
            </div>
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="user-avatar">U</div>
                <div class="user-info">
                    <div class="user-name">User Name</div>
                    <div class="user-role">Admin</div>
                </div>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
        <div class="top-bar">
            <div class="top-bar-left">
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">App Name — Overview</p>
            </div>
            <div class="top-bar-right">
                <div class="sync-status">
                    <span class="sync-dot"></span>
                    Live
                </div>
            </div>
        </div>
        <div class="page-content">
            <!-- Your content here -->
            <div class="kpi-grid">
                <div class="kpi-card health-green">
                    <div class="kpi-header">
                        <span class="kpi-label">Metric</span>
                        <div class="kpi-icon"><i data-lucide="check-circle" style="width:16px;height:16px;"></i></div>
                    </div>
                    <div class="kpi-value">42</div>
                    <div class="kpi-subtitle">description</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Section Title</span>
                </div>
                <div class="card-body no-padding">
                    <table class="data-table">
                        <thead><tr><th>Name</th><th>Status</th><th>Value</th></tr></thead>
                        <tbody>
                            <tr><td>Item 1</td><td><span class="badge badge-green">Active</span></td><td>100</td></tr>
                            <tr><td>Item 2</td><td><span class="badge badge-amber">Pending</span></td><td>50</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>lucide.createIcons(); document.body.classList.add('body-ready');</script>
</body>
</html>
```

---

> [!TIP]
> To rebrand, change **only** `--primary`, `--primary-hover`, `--accent-primary`, and `--accent-cyan` in `:root`. The entire UI updates automatically through the variable cascade.
