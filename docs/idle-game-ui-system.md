# Brmble UI System

This document describes how Brmble handles its UI theming and component system. Your game should use these same patterns so it automatically adapts when users change themes.

---

## 1. How Themes Work

### 1.1 Theme Loading Flow

1. **All theme CSS files are loaded** in `main.tsx`:
   ```tsx
   import './themes/classic.css'
   import './themes/clean.css'
   import './themes/blue-lagoon.css'
   // ... all 8 themes
   ```

2. **Theme is applied** via `data-theme` attribute on `<html>`:
   ```tsx
   // In main.tsx or when settings change
   document.documentElement.setAttribute('data-theme', 'classic');
   ```

3. **CSS cascade** - Each theme defines tokens, so changing `data-theme` swaps which token values are used.

### 1.2 Applying a Theme

```tsx
import { applyTheme } from './themes/theme-loader';

// When user selects a theme
applyTheme('retro-terminal');

// Or from settings
applyTheme(settings.appearance.theme);
```

---

## 2. Token System (The Key Concept)

### 2.1 The Golden Rule

> **Never hardcode colors, sizes, or any visual value. Always use CSS custom property tokens.**

```css
/* ✅ Good - uses tokens */
.game-container {
  background: var(--bg-surface);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

/* ❌ Bad - hardcoded values */
.game-container {
  background: #2a2a35;
  color: #f5f0e8;
  border-radius: 8px;
  padding: 16px;
}
```

When the theme changes, your UI automatically updates because it reads from tokens.

### 2.2 Two Token Layers

| Layer | Location | Contents |
|-------|----------|----------|
| **Global** | `index.css` | Spacing, font sizes, transitions, layout |
| **Per-Theme** | `_template.css` → each theme file | Colors, shadows, effects |

---

## 3. Global Tokens (`index.css`)

These are the same for all themes:

### Spacing
```css
--space-2xs: 0.25rem;  /* 4px */
--space-xs: 0.5rem;    /* 8px */
--space-sm: 0.75rem;   /* 12px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
```

### Font Sizes
```css
--text-2xs: 0.625rem;  /* 10px */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 2rem;     /* 32px */
--text-4xl: 2.5rem;   /* 40px */
```

### Typography
```css
--font-display;  /* Headings, logo, large text */
--font-body;     /* All body text, UI */
--font-mono;     /* Code, technical readouts */
```

### Transitions
```css
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 4. Per-Theme Tokens

Each theme file (e.g., `classic.css`, `retro-terminal.css`) defines these tokens:

### Backgrounds
```css
[data-theme="classic"] {
  --bg-deep: #1a1920;        /* Deepest background */
  --bg-surface: #252330;     /* Card/panel background */
  --bg-primary: #2d2b3a;     /* Primary surfaces */
  --bg-hover: #3a3850;       /* Hover state */
  --bg-glass: rgba(45, 43, 58, 0.85);  /* Glass panels */
}
```

### Text Colors
```css
[data-theme="classic"] {
  --text-primary: #f5f0e8;   /* Main text */
  --text-secondary: #c4bfb4; /* Subdued text */
  --text-muted: #6b6860;      /* Disabled/hint text */
}
```

### Accent Colors
```css
[data-theme="classic"] {
  --accent-primary: #9d6cde;     /* Main accent (purple) */
  --accent-primary-dark: #7b4fb9;
  --accent-primary-glow: #c4a4ff;
  --accent-secondary: #dfa86e;   /* Secondary (gold) */
  --accent-success: #6bcf8e;    /* Success (green) */
  --accent-danger: #cf6b6b;     /* Danger (red) */
}
```

### Effects
```css
[data-theme="classic"] {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.4);
  --glass-blur: blur(12px);
  --glow-sm: 0 0 8px;
  --glow-md: 0 0 16px;
}
```

### Fonts (per theme)
```css
/* classic.css */
--font-display: 'Cormorant Garamond', serif;
--font-body: 'Outfit', sans-serif;

/* retro-terminal.css */
--font-display: 'VT323', monospace;
--font-body: 'IBM Plex Mono', monospace;

/* midori-sour.css */
--font-display: 'Space Mono', monospace;
--font-body: 'Lexend', sans-serif;
```

---

## 5. Heading System

Three tier heading system in `styles/headings.css`:

```css
.heading-title {
  font-family: var(--font-display);
  font-size: var(--heading-title-size);    /* 28px */
  color: var(--heading-title-color);
}

.heading-section {
  font-family: var(--font-display);
  font-size: var(--heading-section-size);  /* 18px */
  color: var(--heading-section-color);
  text-transform: uppercase;
}

.heading-label {
  font-family: var(--font-display);
  font-size: var(--heading-label-size);     /* 10px */
  color: var(--heading-label-color);
  text-transform: uppercase;
  font-style: italic;
}
```

**Usage:**
```tsx
<h2 className="heading-title">Game Title</h2>
<h3 className="heading-section">Upgrades</h3>
<h4 className="heading-label">Resources</h4>
```

---

## 6. Component Patterns

### 6.1 Glass Panel

Used for modals and elevated surfaces:

```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
}
```

### 6.2 Buttons

```css
.btn {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-danger {
  background: var(--accent-danger);
  color: white;
}
```

### 6.3 Hover States

Always use transitions:

```css
.game-button {
  background: var(--bg-primary);
  transition: var(--transition-fast);
}

.game-button:hover {
  background: var(--bg-hover);
}

.game-button:active {
  transform: scale(0.95);
}
```

### 6.4 Focus States

Use the global focus pattern:

```css
.game-button:focus-visible {
  box-shadow: 0 0 0 2px var(--bg-deep), 0 0 0 4px var(--accent-primary);
}
```

---

## 7. Example: Creating a Game UI Component

### CSS (`IdleGame.css`)

```css
.idle-game {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.idle-game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.idle-game-title {
  font-family: var(--font-display);
  font-size: var(--heading-title-size);
  color: var(--heading-title-color);
  margin: 0;
}

.idle-game-currency {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  color: var(--accent-primary-glow);
  text-shadow: var(--glow-md) var(--accent-primary);
}

.idle-game-stats {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
}

.idle-game-stat {
  display: flex;
  flex-direction: column;
}

.idle-game-stat-label {
  font-size: var(--text-2xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.idle-game-stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.idle-game-upgrades {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.idle-game-upgrade {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  transition: var(--transition-fast);
}

.idle-game-upgrade:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
}

.idle-game-upgrade-name {
  font-weight: 600;
  color: var(--text-primary);
}

.idle-game-upgrade-cost {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--accent-secondary);
}
```

### React Component (`IdleGame.tsx`)

```tsx
import './IdleGame.css';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: string;
}

interface IdleGameProps {
  currency: number;
  currencyPerSecond: number;
  upgrades: Upgrade[];
  onPurchase: (id: string) => void;
}

export function IdleGame({ 
  currency, 
  currencyPerSecond, 
  upgrades,
  onPurchase 
}: IdleGameProps) {
  return (
    <div className="idle-game">
      <div className="idle-game-header">
        <h2 className="idle-game-title">Idle Game</h2>
        <div className="idle-game-currency">
          {currency.toLocaleString()} coins
        </div>
      </div>

      <div className="idle-game-stats">
        <div className="idle-game-stat">
          <span className="idle-game-stat-label">Per Second</span>
          <span className="idle-game-stat-value">
            +{currencyPerSecond.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="idle-game-upgrades">
        <h3 className="heading-section">Upgrades</h3>
        {upgrades.map(upgrade => (
          <button
            key={upgrade.id}
            className="idle-game-upgrade"
            onClick={() => onPurchase(upgrade.id)}
          >
            <span className="idle-game-upgrade-name">{upgrade.name}</span>
            <span className="idle-game-upgrade-cost">
              {upgrade.cost.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 8. Key Files Reference

| Purpose | Path |
|---------|------|
| Global tokens | `src/Brmble.Web/src/index.css` |
| Theme template (copy to create new) | `src/Brmble.Web/src/themes/_template.css` |
| Theme loader | `src/Brmble.Web/src/themes/theme-loader.ts` |
| Theme registry | `src/Brmble.Web/src/themes/theme-registry.ts` |
| Classic theme example | `src/Brmble.Web/src/themes/classic.css` |
| Retro Terminal (very different) | `src/Brmble.Web/src/themes/retro-terminal.css` |
| Heading styles | `src/Brmble.Web/src/styles/headings.css` |
| Full UI guide | `docs/UI_GUIDE.md` |

---

## 9. Testing Your UI

1. **Change themes in Settings** - Your game should automatically update colors
2. **Test Retro Terminal** - This theme has near-zero border-radius and monospace fonts
3. **Test reduced motion** - Set `prefers-reduced-motion: reduce` in browser dev tools

Your game automatically works with all themes because it uses tokens instead of hardcoded values.
