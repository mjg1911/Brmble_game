# Idle Farm Game UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a React + TypeScript + Vite idle farm game with Brmble-style theming, featuring a header with money/income, three tabs (Crops, Upgrades, Options), and localStorage persistence.

**Architecture:** Token-based CSS theming system copied from Brmble. All UI components use CSS custom properties for colors/spacing. State managed via React hooks with localStorage for persistence.

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules

---

## Phase 1: Project Setup

### Task 1: Initialize Vite + React + TypeScript Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

**Step 1: Create package.json**

```json
{
  "name": "idle-farm-game",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react-hooks": "^4.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Step 4: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Step 5: Create index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Idle Farm Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 6: Create src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './themes/classic.css'
import './themes/retro-terminal.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 7: Create src/App.tsx**

```tsx
import { useState } from 'react'
import { GameUI } from './components/GameUI/GameUI'
import { useGameState } from './hooks/useGameState'

function App() {
  const gameState = useGameState()
  
  return (
    <div className="app">
      <GameUI state={gameState.state} actions={gameState.actions} />
    </div>
  )
}

export default App
```

**Step 8: Create src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

**Step 9: Run npm install**

Run: `npm install`
Expected: Installs all dependencies

**Step 10: Commit**

```bash
git add package.json tsconfig.json tsconfig.node.json vite.config.ts index.html src/
git commit -m "feat: initialize Vite + React + TypeScript project"
```

---

### Task 2: Create Global CSS Tokens

**Files:**
- Create: `src/index.css`
- Create: `src/styles/headings.css`

**Step 1: Create src/index.css**

```css
:root {
  /* Spacing */
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Font Sizes */
  --text-2xs: 0.625rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;

  /* Typography */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Layout */
  --header-height: 48px;
  --sidebar-width: 200px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: var(--bg-deep);
  color: var(--text-primary);
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@import './styles/headings.css';
```

**Step 2: Create src/styles/headings.css**

```css
.heading-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--heading-title-color, var(--text-primary));
}

.heading-section {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--heading-section-color, var(--text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.heading-label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--heading-label-color, var(--text-muted));
  text-transform: uppercase;
  font-style: italic;
}
```

**Step 3: Commit**

```bash
git add src/index.css src/styles/headings.css
git commit -m "feat: add global CSS tokens and heading styles"
```

---

### Task 3: Create Theme Files

**Files:**
- Create: `src/themes/classic.css`
- Create: `src/themes/retro-terminal.css`
- Create: `src/themes/theme-loader.ts`

**Step 1: Create src/themes/classic.css**

```css
[data-theme="classic"] {
  /* Backgrounds */
  --bg-deep: #1a1920;
  --bg-surface: #252330;
  --bg-primary: #2d2b3a;
  --bg-hover: #3a3850;
  --bg-glass: rgba(45, 43, 58, 0.85);

  /* Text */
  --text-primary: #f5f0e8;
  --text-secondary: #c4bfb4;
  --text-muted: #6b6860;

  /* Accents */
  --accent-primary: #9d6cde;
  --accent-primary-dark: #7b4fb9;
  --accent-primary-glow: #c4a4ff;
  --accent-secondary: #dfa86e;
  --accent-success: #6bcf8e;
  --accent-danger: #cf6b6b;

  /* Effects */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.4);
  --glass-blur: blur(12px);
  --glow-sm: 0 0 8px;
  --glow-md: 0 0 16px;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.12);

  /* Heading colors */
  --heading-title-color: var(--text-primary);
  --heading-section-color: var(--text-secondary);
  --heading-label-color: var(--text-muted);
}
```

**Step 2: Create src/themes/retro-terminal.css**

```css
[data-theme="retro-terminal"] {
  /* Backgrounds */
  --bg-deep: #0a0a0a;
  --bg-surface: #0f0f0f;
  --bg-primary: #1a1a1a;
  --bg-hover: #252525;
  --bg-glass: rgba(0, 0, 0, 0.9);

  /* Text */
  --text-primary: #00ff41;
  --text-secondary: #00cc33;
  --text-muted: #006622;

  /* Accents */
  --accent-primary: #00ff41;
  --accent-primary-dark: #00cc33;
  --accent-primary-glow: #00ff41;
  --accent-secondary: #ffcc00;
  --accent-success: #00ff41;
  --accent-danger: #ff3333;

  /* Effects */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --shadow-elevated: none;
  --glass-blur: none;
  --glow-sm: 0 0 4px;
  --glow-md: 0 0 8px;

  /* Borders */
  --border-subtle: #00ff41;
  --glass-border: #00ff41;

  /* Typography - monospace */
  --font-display: 'VT323', monospace;
  --font-body: 'VT323', monospace;
  --font-mono: 'VT323', monospace;

  /* Heading colors */
  --heading-title-color: var(--accent-primary);
  --heading-section-color: var(--text-primary);
  --heading-label-color: var(--text-secondary);
}
```

**Step 3: Create src/themes/theme-loader.ts**

```typescript
const AVAILABLE_THEMES = ['classic', 'retro-terminal'] as const;
export type ThemeName = typeof AVAILABLE_THEMES[number];

const STORAGE_KEY = 'idle-farm-theme';

export function getStoredTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && AVAILABLE_THEMES.includes(stored as ThemeName)) {
    return stored as ThemeName;
  }
  return 'classic';
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initTheme(): void {
  const theme = getStoredTheme();
  applyTheme(theme);
}

export { AVAILABLE_THEMES };
```

**Step 4: Update main.tsx to initialize theme**

Modify `src/main.tsx` to import initTheme and call it before render:

```tsx
import { initTheme } from './themes/theme-loader'
initTheme()
```

**Step 5: Commit**

```bash
git add src/themes/
git commit -m "feat: add theme system with classic and retro-terminal themes"
```

---

## Phase 2: Game State & Types

### Task 4: Create TypeScript Types

**Files:**
- Create: `src/types/game.ts`

**Step 1: Create src/types/game.ts**

```typescript
export interface Crop {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  owned: number;
  unlocked: boolean;
  unlockCost?: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  rewards: string[];
}

export interface GameState {
  money: number;
  incomePerSecond: number;
  crops: Crop[];
  upgrades: Upgrade[];
  lastSaved: number;
}

export interface GameActions {
  buyCrop: (cropId: string) => void;
  setTheme: (theme: string) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  exportSave: () => string;
  importSave: (data: string) => boolean;
}

export const INITIAL_CROPS: Crop[] = [
  { id: 'wheat', name: 'Wheat', baseCost: 1420, baseIncome: 51, owned: 0, unlocked: true },
  { id: 'corn', name: 'Corn', baseCost: 4830, baseIncome: 96, owned: 0, unlocked: true },
  { id: 'potatoes', name: 'Potatoes', baseCost: 11000, baseIncome: 180, owned: 0, unlocked: false, unlockCost: 5000 },
  { id: 'carrots', name: 'Carrots', baseCost: 28000, baseIncome: 320, owned: 0, unlocked: false, unlockCost: 15000 },
  { id: 'tomatoes', name: 'Tomatoes', baseCost: 65000, baseIncome: 550, owned: 0, unlocked: false, unlockCost: 40000 },
];

export const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'potatoes-unlock', name: 'Unlock Potatoes', description: 'Unlock Potatoes crop', requirement: 5000, unlocked: false, rewards: ['Unlock Potatoes', 'Unlock Corn Upgrades'] },
  { id: 'carrots-unlock', name: 'Unlock Carrots', description: 'Unlock Carrots crop', requirement: 15000, unlocked: false, rewards: ['Unlock Carrots'] },
  { id: 'tomatoes-unlock', name: 'Unlock Tomatoes', description: 'Unlock Tomatoes crop', requirement: 40000, unlocked: false, rewards: ['Unlock Tomatoes'] },
];

export const INITIAL_STATE: GameState = {
  money: 12540,
  incomePerSecond: 0,
  crops: INITIAL_CROPS,
  upgrades: INITIAL_UPGRADES,
  lastSaved: Date.now(),
};
```

**Step 2: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: add TypeScript types and initial game state"
```

---

### Task 5: Create useGameState Hook

**Files:**
- Create: `src/hooks/useGameState.ts`

**Step 1: Create src/hooks/useGameState.ts**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { GameState, GameActions, INITIAL_STATE, Crop, Upgrade } from '../types/game';
import { applyTheme, ThemeName } from '../themes/theme-loader';

const STORAGE_KEY = 'idle-farm-save';

function calculateIncome(crops: Crop[]): number {
  return crops.reduce((total, crop) => {
    if (!crop.unlocked) return total;
    return total + (crop.baseIncome * crop.owned);
  }, 0);
}

function getNextUnlock(crops: Crop[]): Crop | null {
  const locked = crops.find(c => !c.unlocked && c.unlockCost);
  return locked || null;
}

function canAfford(money: number, cost: number): boolean {
  return money >= cost;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Calculate income whenever crops change
  useEffect(() => {
    const income = calculateIncome(state.crops);
    setState(prev => ({ ...prev, incomePerSecond: income }));
  }, [state.crops]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

  // Income tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        money: prev.money + prev.incomePerSecond,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.incomePerSecond]);

  const buyCrop = useCallback((cropId: string) => {
    setState(prev => {
      const crops = prev.crops.map(crop => {
        if (crop.id !== cropId || !crop.unlocked) return crop;
        
        const cost = Math.floor(crop.baseCost * Math.pow(1.15, crop.owned));
        if (prev.money < cost) return crop;

        // Check for unlocks
        let unlockedCrops = [...crops];
        unlockedCrops = unlockedCrops.map(c => {
          if (c.unlockCost && prev.money >= c.unlockCost && !c.unlocked) {
            return { ...c, unlocked: true };
          }
          return c;
        });

        return {
          ...crop,
          owned: crop.owned + 1,
        };
      });

      // Find the crop that was bought to get its cost
      const boughtCrop = prev.crops.find(c => c.id === cropId);
      if (!boughtCrop || !boughtCrop.unlocked) return prev;
      
      const cost = Math.floor(boughtCrop.baseCost * Math.pow(1.15, boughtCrop.owned));
      if (prev.money < cost) return prev;

      // Check for unlocks after purchase
      const newCrops = crops.map(c => {
        if (c.unlockCost && prev.money >= c.unlockCost && !c.unlocked) {
          return { ...c, unlocked: true };
        }
        return c;
      });

      return {
        ...prev,
        crops: newCrops,
        money: prev.money - cost,
      };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    applyTheme(theme as ThemeName);
  }, []);

  const saveGame = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  }, [state]);

  const loadGame = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        // Invalid save data
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }, []);

  const exportSave = useCallback((): string => {
    return JSON.stringify(state);
  }, [state]);

  const importSave = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      setState(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  const actions: GameActions = {
    buyCrop,
    setTheme,
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave,
  };

  // Calculate derived state for UI
  const nextUnlock = getNextUnlock(state.crops);

  return {
    state,
    actions,
    nextUnlock,
  };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useGameState.ts
git commit -m "feat: add useGameState hook with income calculation and auto-save"
```

---

## Phase 3: UI Components

### Task 6: Create GameUI Main Container

**Files:**
- Create: `src/components/GameUI/GameUI.tsx`
- Create: `src/components/GameUI/GameUI.css`

**Step 1: Create src/components/GameUI/GameUI.tsx**

```typescript
import { useState } from 'react';
import { GameState, GameActions } from '../../types/game';
import { Header } from './Header';
import { TabNav } from './TabNav';
import { CropsTab } from './CropsTab';
import { UpgradesTab } from './UpgradesTab';
import { OptionsTab } from './OptionsTab';
import './GameUI.css';

type TabId = 'crops' | 'upgrades' | 'options';

interface GameUIProps {
  state: GameState;
  actions: GameActions;
}

export function GameUI({ state, actions }: GameUIProps) {
  const [activeTab, setActiveTab] = useState<TabId>('crops');

  return (
    <div className="game-ui">
      <Header 
        money={state.money} 
        income={state.incomePerSecond} 
      />
      <div className="game-body">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="game-content">
          {activeTab === 'crops' && (
            <CropsTab crops={state.crops} onBuy={actions.buyCrop} money={state.money} />
          )}
          {activeTab === 'upgrades' && (
            <UpgradesTab 
              crops={state.crops} 
              upgrades={state.upgrades} 
              money={state.money} 
            />
          )}
          {activeTab === 'options' && (
            <OptionsTab 
              onSetTheme={actions.setTheme}
              onSave={actions.saveGame}
              onLoad={actions.loadGame}
              onReset={actions.resetGame}
              onExport={actions.exportSave}
              onImport={actions.importSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create src/components/GameUI/GameUI.css**

```css
.game-ui {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-deep);
}

.game-body {
  display: flex;
  flex: 1;
  padding: var(--space-lg);
  gap: var(--space-lg);
}

.game-content {
  flex: 1;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border: 1px solid var(--border-subtle);
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/
git commit -m "feat: create GameUI main container"
```

---

### Task 7: Create Header Component

**Files:**
- Create: `src/components/GameUI/Header.tsx`
- Create: `src/components/GameUI/Header.css`

**Step 1: Create src/components/GameUI/Header.tsx**

```typescript
import './Header.css';

interface HeaderProps {
  money: number;
  income: number;
}

export function Header({ money, income }: HeaderProps) {
  return (
    <header className="game-header">
      <div className="header-stat">
        <span className="header-label">MONEY:</span>
        <span className="header-value currency">${money.toLocaleString()}</span>
      </div>
      <div className="header-stat">
        <span className="header-label">INCOME:</span>
        <span className="header-value income">+{income.toLocaleString()}</span>
      </div>
    </header>
  );
}
```

**Step 2: Create src/components/GameUI/Header.css**

```css
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  height: var(--header-height);
}

.header-stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.header-label {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header-value {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: bold;
}

.header-value.currency {
  color: var(--accent-secondary);
  text-shadow: var(--glow-sm) var(--accent-secondary);
}

.header-value.income {
  color: var(--accent-success);
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/Header.tsx src/components/GameUI/Header.css
git commit -m "feat: create Header component with money and income display"
```

---

### Task 8: Create TabNav Component

**Files:**
- Create: `src/components/GameUI/TabNav.tsx`
- Create: `src/components/GameUI/TabNav.css`

**Step 1: Create src/components/GameUI/TabNav.tsx**

```typescript
import './TabNav.css';

type TabId = 'crops' | 'upgrades' | 'options';

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'crops', label: 'Crops' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'options', label: 'Options' },
];

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="tab-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

**Step 2: Create src/components/GameUI/TabNav.css**

```css
.tab-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 140px;
}

.tab-button {
  font-family: var(--font-display);
  font-size: var(--text-base);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
}

.tab-button:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.tab-button.active {
  background: var(--bg-primary);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/TabNav.tsx src/components/GameUI/TabNav.css
git commit -m "feat: create TabNav vertical tab navigation"
```

---

### Task 9: Create CropsTab Component

**Files:**
- Create: `src/components/GameUI/CropsTab.tsx`
- Create: `src/components/GameUI/CropsTab.css`

**Step 1: Create src/components/GameUI/CropsTab.tsx**

```typescript
import { Crop } from '../../types/game';
import './CropsTab.css';

interface CropsTabProps {
  crops: Crop[];
  onBuy: (cropId: string) => void;
  money: number;
}

function calculateCost(crop: Crop): number {
  return Math.floor(crop.baseCost * Math.pow(1.15, crop.owned));
}

export function CropsTab({ crops, onBuy, money }: CropsTabProps) {
  return (
    <div className="crops-tab">
      <h2 className="heading-section">Crops</h2>
      <table className="crops-table">
        <thead>
          <tr>
            <th>CROP</th>
            <th>COST</th>
            <th>OWNED</th>
            <th>GAIN/s</th>
            <th>BUY</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(crop => {
            const cost = calculateCost(crop);
            const canBuy = crop.unlocked && money >= cost;

            return (
              <tr key={crop.id} className={!crop.unlocked ? 'locked' : ''}>
                <td className="crop-name">{crop.name}</td>
                <td className="crop-cost">
                  {crop.unlocked ? `$${cost.toLocaleString()}` : `$${crop.unlockCost?.toLocaleString()}`}
                </td>
                <td className="crop-owned">
                  {crop.unlocked ? crop.owned : 'LOCKED'}
                </td>
                <td className="crop-gain">
                  {crop.unlocked ? crop.baseIncome : '-'}
                </td>
                <td className="crop-buy">
                  <button
                    className="btn btn-primary buy-button"
                    disabled={!canBuy}
                    onClick={() => onBuy(crop.id)}
                  >
                    BUY
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

**Step 2: Create src/components/GameUI/CropsTab.css**

```css
.crops-tab {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.crops-table {
  width: 100%;
  border-collapse: collapse;
}

.crops-table th {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--space-sm);
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);
}

.crops-table td {
  padding: var(--space-md) var(--space-sm);
  border-bottom: 1px solid var(--border-subtle);
}

.crops-table tr:hover {
  background: var(--bg-hover);
}

.crops-table tr.locked {
  opacity: 0.6;
}

.crop-name {
  font-weight: 600;
  color: var(--text-primary);
}

.crop-cost {
  font-family: var(--font-mono);
  color: var(--accent-secondary);
}

.crop-owned {
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.crop-gain {
  font-family: var(--font-mono);
  color: var(--accent-success);
}

.crop-buy {
  text-align: center;
}

.buy-button {
  min-width: 80px;
}

.buy-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Step 3: Add button styles to index.css**

Append to src/index.css:

```css
/* Button base styles */
.btn {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-primary-dark);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--accent-danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  opacity: 0.9;
}
```

**Step 4: Commit**

```bash
git add src/components/GameUI/CropsTab.tsx src/components/GameUI/CropsTab.css src/index.css
git commit -m "feat: create CropsTab with purchase table"
```

---

### Task 10: Create UpgradesTab Component

**Files:**
- Create: `src/components/GameUI/UpgradesTab.tsx`
- Create: `src/components/GameUI/UpgradesTab.css`
- Create: `src/components/GameUI/ProgressBar.tsx`
- Create: `src/components/GameUI/ProgressBar.css`

**Step 1: Create src/components/GameUI/ProgressBar.tsx**

```typescript
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="progress-container">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-percent">{Math.round(percentage)}%</span>
    </div>
  );
}
```

**Step 2: Create src/components/GameUI/ProgressBar.css**

```css
.progress-container {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.progress-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  min-width: 100px;
}

.progress-bar {
  flex: 1;
  height: 16px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-primary-glow));
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.progress-percent {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}
```

**Step 3: Create src/components/GameUI/UpgradesTab.tsx**

```typescript
import { Crop, Upgrade } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import './UpgradesTab.css';

interface UpgradesTabProps {
  crops: Crop[];
  upgrades: Upgrade[];
  money: number;
}

export function UpgradesTab({ crops, upgrades, money }: UpgradesTabProps) {
  const nextUnlock = crops.find(c => !c.unlocked && c.unlockCost);
  const nextUpgrade = upgrades.find(u => !u.unlocked);

  return (
    <div className="upgrades-tab">
      <h2 className="heading-section">Unlocks</h2>
      
      {nextUnlock ? (
        <div className="unlock-card">
          <div className="unlock-info">
            <span className="unlock-label">Next Crop:</span>
            <span className="unlock-value">{nextUnlock.name}</span>
          </div>
          <div className="unlock-info">
            <span className="unlock-label">Unlock Requirement:</span>
            <span className="unlock-value cost">${nextUnlock.unlockCost?.toLocaleString()}</span>
          </div>
          
          <div className="unlock-progress">
            <ProgressBar 
              value={money} 
              max={nextUnlock.unlockCost!} 
              label="Progress:"
            />
          </div>

          {nextUpgrade && (
            <div className="unlock-rewards">
              <span className="rewards-label">Reward:</span>
              <ul className="rewards-list">
                {nextUpgrade.rewards.map((reward, i) => (
                  <li key={i}>{reward}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="all-unlocked">
          <p>All crops unlocked!</p>
        </div>
      )}
    </div>
  );
}
```

**Step 4: Create src/components/GameUI/UpgradesTab.css**

```css
.upgrades-tab {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.unlock-card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--border-subtle);
}

.unlock-info {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.unlock-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.unlock-value {
  font-weight: 600;
  color: var(--text-primary);
}

.unlock-value.cost {
  color: var(--accent-secondary);
  font-family: var(--font-mono);
}

.unlock-progress {
  margin-top: var(--space-lg);
}

.unlock-rewards {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-subtle);
}

.rewards-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.rewards-list {
  list-style: none;
  margin-top: var(--space-xs);
}

.rewards-list li {
  font-size: var(--text-sm);
  color: var(--accent-success);
  padding: var(--space-2xs) 0;
}

.rewards-list li::before {
  content: "✓ ";
}

.all-unlocked {
  text-align: center;
  padding: var(--space-xl);
  color: var(--accent-success);
}
```

**Step 5: Commit**

```bash
git add src/components/GameUI/UpgradesTab.tsx src/components/GameUI/UpgradesTab.css
git add src/components/GameUI/ProgressBar.tsx src/components/GameUI/ProgressBar.css
git commit -m "feat: create UpgradesTab with progress bar"
```

---

### Task 11: Create OptionsTab Component

**Files:**
- Create: `src/components/GameUI/OptionsTab.tsx`
- Create: `src/components/GameUI/OptionsTab.css`

**Step 1: Create src/components/GameUI/OptionsTab.tsx**

```typescript
import { useState } from 'react';
import { AVAILABLE_THEMES, ThemeName } from '../../themes/theme-loader';
import './OptionsTab.css';

interface OptionsTabProps {
  onSetTheme: (theme: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => string;
  onImport: (data: string) => boolean;
}

export function OptionsTab({ 
  onSetTheme, 
  onSave, 
  onLoad, 
  onReset, 
  onExport,
  onImport 
}: OptionsTabProps) {
  const [importData, setImportData] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const handleExport = () => {
    const data = onExport();
    navigator.clipboard.writeText(data);
    setImportStatus('Save data copied to clipboard!');
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      setImportStatus('Please paste save data first');
      return;
    }
    const success = onImport(importData);
    setImportStatus(success ? 'Save imported successfully!' : 'Invalid save data');
    if (success) setImportData('');
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onReset();
      setImportStatus('Game reset!');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="options-tab">
      <h2 className="heading-section">Options</h2>

      <div className="options-section">
        <h3 className="options-section-title">Theme</h3>
        <select 
          className="options-select"
          onChange={(e) => onSetTheme(e.target.value)}
          defaultValue="classic"
        >
          {AVAILABLE_THEMES.map(theme => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="options-section">
        <h3 className="options-section-title">Sound</h3>
        <div className="options-slider-container">
          <label className="options-label">Volume</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="options-slider"
          />
          <span className="options-value">{volume}%</span>
        </div>
      </div>

      <div className="options-section">
        <h3 className="options-section-title">Game Data</h3>
        <div className="options-buttons">
          <button className="btn btn-secondary" onClick={onSave}>
            Save Now
          </button>
          <button className="btn btn-secondary" onClick={onLoad}>
            Load Save
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            Export
          </button>
        </div>
        
        <div className="import-section">
          <label className="options-label">Import Save Data</label>
          <textarea
            className="options-textarea"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste save data here..."
            rows={3}
          />
          <button className="btn btn-secondary" onClick={handleImport}>
            Import
          </button>
        </div>

        <div className="danger-zone">
          <button className="btn btn-danger" onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="import-status">{importStatus}</div>
      )}
    </div>
  );
}
```

**Step 2: Create src/components/GameUI/OptionsTab.css**

```css
.options-tab {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.options-section-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
}

.options-select {
  font-family: var(--font-body);
  font-size: var(--text-base);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.options-select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.options-slider-container {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.options-slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.options-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
}

.options-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  min-width: 40px;
}

.options-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.options-buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.import-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-subtle);
}

.options-textarea {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: var(--space-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  resize: vertical;
}

.options-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.options-textarea::placeholder {
  color: var(--text-muted);
}

.danger-zone {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-subtle);
}

.import-status {
  padding: var(--space-sm);
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  color: var(--accent-success);
  text-align: center;
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/OptionsTab.tsx src/components/GameUI/OptionsTab.css
git commit -m "feat: create OptionsTab with theme, sound, and save/load controls"
```

---

## Phase 4: Final Integration & Testing

### Task 12: Build and Verify

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Start dev server and verify**

Run: `npm run dev`
Expected: Server starts, open browser to verify UI renders

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete idle farm game UI implementation"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Initialize Vite + React + TypeScript project |
| 2 | Create global CSS tokens |
| 3 | Create theme system (classic, retro-terminal) |
| 4 | Create TypeScript types and initial state |
| 5 | Create useGameState hook |
| 6 | Create GameUI container |
| 7 | Create Header component |
| 8 | Create TabNav component |
| 9 | Create CropsTab component |
| 10 | Create UpgradesTab component |
| 11 | Create OptionsTab component |
| 12 | Build and verify |
