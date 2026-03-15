# Idle Farm

An idle farm browser game built as a modular React application with TypeScript. This game integrates with the Brmble desktop application and uses the comprehensive Brmble theming system.

**Date:** 2026-03-15

---

## 1. Project Overview

- **Type:** Idle/incremental browser game (integrated with Brmble desktop app)
- **Tech Stack:** React + TypeScript + Vite
- **Graphics:** Pixel art via CSS styling and themed UI components
- **Persistence:** Auto-save to localStorage / JSON file via Brmble bridge

### Core Gameplay Loop

1. Buy crops/trees with your starting money
2. Each crop generates passive income per second
3. Reinvest earnings to buy more crops
4. Each purchase costs 1.15x more than the last
5. Unlock new crops in the Unlock tab when you reach money thresholds
6. Only the next crop is visible at a time (progressive reveal)

---

## 2. Game Features

### Crops / Income Sources

Buy crops/trees that generate passive income per second. Each purchase increases the cost by 1.15x.

**Progression:** Start with Wheat and Corn unlocked. Unlock new crops by reaching money thresholds in the Unlock tab. Only the next crop is visible (1 upgrade ahead).

| Crop/Item | Base Income/sec | Base Cost | Unlock Requirement |
|-----------|-----------------|-----------|------------------|
| Wheat | $1 | $10 | Starting (unlocked) |
| Corn | $8 | $100 | Starting (unlocked) |
| Potatoes | $47 | $1,100 | $5,000 |
| Sugarcane | $260 | $12,000 | $50,000 |
| Cotton | $2,000 | $130,000 | $500,000 |
| Coffee Beans | $15,000 | $1,400,000 | $5,000,000 |
| Cocoa Pods | $120,000 | $20,000,000 | $75,000,000 |
| Golden Apples | $600,000 | $330,000,000 | $1,000,000,000 |
| Starfruit | $4,000,000 | $5,100,000,000 | $15,000,000,000 |
| Moon Melons | $25,000,000 | $75,000,000,000 | $200,000,000,000 |
| Ethereal Lotus | $160,000,000 | $1,000,000,000,000 | $5,000,000,000,000 |
| Chrono-Vines | $1,000,000,000 | $14,000,000,000,000 | $50,000,000,000,000 |
| Void Berries | $7,000,000,000 | $170,000,000,000,000 | $500,000,000,000,000 |

### Upgrades

When you unlock a new crop, you unlock upgrades for the previous crop (the one before your newest unlocked crop). These upgrades are always behind your current newest crop.

**How it works:**
- Start with Wheat and Corn unlocked → upgrades for Wheat available
- Unlock Potatoes → now upgrades for Corn available
- Unlock Sugarcane → now upgrades for Potatoes available
- And so on...

**Upgrade Types:**
- **Improved Soil:** +50% income for that crop (stackable)
- **Fertilizer:** +25% income for that crop (stackable)
- **Better Seeds:** +100% income for that crop (stackable)

Each upgrade type can be purchased multiple times, each purchase increases the cost by 1.5x.

---

## 3. Architecture

### Component Structure

```
src/
├── components/
│   ├── CropField/         # Buy crops, see owned crops
│   ├── UnlockTab/         # Unlock new crops when thresholds met
│   ├── UpgradeShop/       # Multipliers and bonuses
│   ├── ResourcePanel/    # Money and income/sec display
│   └── GameDashboard/     # Main game layout with tabs
├── hooks/
│   └── useGameState.ts    # Game state management
├── types/
│   └── game.ts            # TypeScript interfaces
└── utils/
    └── gameLogic.ts       # Core game calculations
```

### State Management

```typescript
interface GameState {
  money: number;
  crops: CropState[];
  animals: AnimalState[];
  upgrades: string[];
  totalEarnings: number;
  lastSaved: number;
}
```

---

## 4. UI System

This project uses the Brmble theming system. **Always use CSS custom property tokens instead of hardcoded values.**

### Global Tokens

Always available (defined in `index.css`):

```css
/* Spacing */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl

/* Typography */
--font-display, --font-body, --font-mono
--text-sm, --text-base, --text-lg, --text-xl

/* Transitions */
--transition-fast, --transition-normal, --transition-slow
```

### Theme Tokens

Colors and effects change based on the active theme:

```css
/* Use these for backgrounds */
--bg-deep, --bg-surface, --bg-primary, --bg-hover

/* Use these for text */
--text-primary, --text-secondary, --text-muted

/* Use these for accents */
--accent-primary, --accent-secondary
--accent-success, --accent-danger
```

### Component Patterns

```css
/* Panel/card */
.game-panel {
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

/* Button */
.btn {
  background: var(--accent-primary);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.btn:hover {
  background: var(--bg-hover);
}

/* Progress bar */
.progress-bar {
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  background: var(--accent-success);
  height: 100%;
  transition: width var(--transition-normal);
}
```

---

## 5. Persistence

### Auto-Save

- Saves every 30 seconds automatically
- Saves on window close/blur
- Validates save data on load

### Save Data Structure

```typescript
interface SaveData {
  version: number;
  timestamp: number;
  money: number;
  crops: CropSave[];
  animals: AnimalSave[];
  upgrades: string[];
  stats: {
    totalEarnings: number;
    totalHarvests: number;
    totalCollections: number;
  };
}
```

### Reset Progress

A hard reset option is available in settings that clears all save data and resets to initial state.

---

## 6. Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

---

## 7. Git Workflow

### Branch Naming

- `feature/<feature-name>` - New features
- `fix/<issue-name>` - Bug fixes
- `docs/<topic>` - Documentation

### Process

1. Create a new branch for any changes
2. Make commits with clear messages
3. **Run tests before committing**
4. Ask before pushing or creating PRs

### Never Do

- ❌ Commit directly to main
- ❌ Push to main
- ❌ Skip tests
- ❌ Hardcode colors or sizes

---

## 8. Testing Checklist

Before marking work as complete:

- [ ] All tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Game saves and loads correctly
- [ ] UI works with different themes
- [ ] No hardcoded values in CSS

---

## 9. Reference

| Topic | Location |
|-------|----------|
| UI Theming | `docs/idle-game-ui-system.md` |
| Architecture | `docs/idle-game-architecture.md` |
| Agent Guidelines | `AGENTS.md` |
