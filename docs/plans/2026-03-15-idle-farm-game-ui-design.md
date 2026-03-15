# Idle Farm Game UI Design

**Date:** 2026-03-15

## Overview

Browser-based idle farm game with pixel-art aesthetic. UI follows Brmble's token-based theming system for automatic theme support. Auto-saves to localStorage.

---

## UI Layout

```
+-----------------------------------------------------------+
| MONEY: $12,540                               INCOME: 184 |
+-----------------------------------------------------------+
| CROPS         |     Upgrades      |      Options
+----------------+-----------+-----------+---------+--------+
|     CROP       |   COST    |  OWNED    | GAIN/s  |  BUY   |
+----------------+-----------+-----------+---------+--------+
| Wheat          |   1,420   |    34     |   51    | [BUY]  |
| Corn           |   4,830   |    12     |   96    | [BUY]  |
| Potatoes       |  11,000   |   LOCKED  |    -    |   -    |
+----------------+-----------+-----------+---------+--------+
```

### Layout Structure

- **Header Bar**: Fixed top bar showing Money and Income
- **Left-Side Vertical Tabs**: CROPS | UPGRADES | OPTIONS
- **Content Area**: Dynamic content based on selected tab

---

## Tab Contents

### CROPS Tab

Table with columns:
- **CROP**: Crop name (Wheat, Corn, Potatoes...)
- **COST**: Purchase cost
- **OWNED**: Quantity owned (or "LOCKED")
- **GAIN/s**: Income per second (or "-" for locked)
- **BUY**: Buy button (disabled if locked or insufficient funds)

### UPGRADES Tab

Unlock progress display:
- **Next Crop**: Name of next unlockable crop
- **Unlock Requirement**: Money threshold
- **Progress Bar**: Visual percentage
- **Reward List**: What unlocking provides

### OPTIONS Tab

- **Theme Selector**: Dropdown to switch themes
- **Sound Settings**: Volume slider, mute toggle
- **Game Data**: Export, Import, Reset buttons

---

## Theme System (Brmble Pattern)

### Token Usage

All colors, spacing, and effects use CSS custom properties:

```css
.game-header {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
}

.buy-button {
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.buy-button:hover {
  background: var(--accent-primary-dark);
}

.currency {
  color: var(--accent-secondary);
  font-family: var(--font-mono);
}
```

### Initial Themes

1. **classic** - Default Brmble theme (purple accent)
2. **retro-terminal** - Monospace, green-on-black

Adding new themes = creating a new CSS file with token values.

---

## Data Structures

### Crop

```typescript
interface Crop {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  owned: number;
  unlocked: boolean;
  unlockCost?: number;
}
```

### GameState

```typescript
interface GameState {
  money: number;
  incomePerSecond: number;
  crops: Crop[];
  lastSaved: number;
}
```

---

## Component List

| Component | Purpose |
|-----------|---------|
| `GameUI` | Main container, manages active tab |
| `Header` | Money/Income display bar |
| `TabNav` | Vertical tab navigation |
| `CropsTable` | Crop purchase table |
| `UpgradesPanel` | Unlock progress display |
| `OptionsPanel` | Theme, sound, save controls |
| `ProgressBar` | Reusable progress indicator |
| `BuyButton` | Crop purchase button |

---

## Implementation Priority

1. **Phase 1**: Project setup, theme tokens, basic layout
2. **Phase 2**: Header, tab navigation, Crops table
3. **Phase 3**: Upgrades tab with progress bar
4. **Phase 4**: Options tab (theme selector, save/load)
5. **Phase 5**: Game state, income calculation, auto-save

---

## Acceptance Criteria

- [ ] Header displays money and income correctly
- [ ] Three tabs navigable (Crops, Upgrades, Options)
- [ ] Crops table shows all crops with buy buttons
- [ ] Locked crops show "LOCKED" and disabled buy
- [ ] Upgrades tab shows progress toward next unlock
- [ ] Options tab allows theme switching
- [ ] Theme changes apply instantly to all UI
- [ ] Game state persists in localStorage
- [ ] Income auto-calculated per second
