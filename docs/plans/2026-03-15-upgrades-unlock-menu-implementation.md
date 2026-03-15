# Upgrades/Unlock Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add working unlock functionality to the Upgrades tab - when progress bar fills, show button to unlock crop. Also display list of already unlocked crops.

**Architecture:** Add unlockCrop action to useGameState, wire it up to a button in the UpgradesTab component. Display unlocked crops list and current unlock progress.

**Tech Stack:** React, TypeScript

---

### Task 1: Add unlockCrop Action to useGameState

**Files:**
- Modify: `src/hooks/useGameState.ts`

**Step 1: Add unlockCrop function**

Find line 139 (after upgradeSeeds function), add:

```typescript
const unlockCrop = useCallback((cropId: string) => {
  setState(prev => {
    const crop = prev.crops.find(c => c.id === cropId);
    if (!crop || crop.unlocked || !crop.unlockCost) return prev;
    if (prev.money < crop.unlockCost) return prev;

    return {
      ...prev,
      crops: prev.crops.map(c => 
        c.id === cropId ? { ...c, unlocked: true } : c
      ),
      money: prev.money - crop.unlockCost,
    };
  });
}, []);
```

**Step 2: Add unlockCrop to GameActions type**

Find the GameActions interface in `src/types.ts`, add:

```typescript
unlockCrop: (cropId: string) => void;
```

**Step 3: Add unlockCrop to actions object**

In useGameState.ts, find the actions object (around line 180), add:

```typescript
unlockCrop,
```

**Step 4: Commit**

```bash
git add src/hooks/useGameState.ts src/types.ts
git commit -m "feat: add unlockCrop action"
```

---

### Task 2: Pass unlockCrop to UpgradesTab

**Files:**
- Modify: `src/components/GameUI/GameUI.tsx`

**Step 1: Add onUnlock prop to UpgradesTab**

Find line 37-41 where UpgradesTab is rendered, change to:

```typescript
{activeTab === 'upgrades' && (
  <UpgradesTab 
    crops={state.crops} 
    money={state.money}
    onUnlock={actions.unlockCrop}
  />
)}
```

**Step 2: Update UpgradesTab function signature**

Find line 207, change to:

```typescript
function UpgradesTab({ crops, money, onUnlock }: { crops: Crop[]; money: number; onUnlock: (cropId: string) => void }) {
```

**Step 3: Commit**

```bash
git add src/components/GameUI/GameUI.tsx
git commit -m "feat: pass unlockCrop to UpgradesTab"
```

---

### Task 3: Add Unlock Button to UpgradesTab

**Files:**
- Modify: `src/components/GameUI/GameUI.tsx`

**Step 1: Add unlock button when progress >= 100%**

Find the UpgradesTab function (around line 207). Replace the unlock-card section with:

```typescript
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
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>
    </div>

    {progress >= 100 ? (
      <button
        className="btn btn-primary unlock-btn"
        onClick={() => onUnlock(nextUnlock.id)}
      >
        UNLOCK {nextUnlock.name.toUpperCase()}
      </button>
    ) : (
      <div className="unlock-rewards">
        <span className="rewards-label">Reward:</span>
        <ul className="rewards-list">
          <li>Unlock {nextUnlock.name}</li>
        </ul>
      </div>
    )}
  </div>
) : (
  <div className="all-unlocked">
    <p>All crops unlocked!</p>
  </div>
)}
```

**Step 2: Add CSS for unlock button**

Add to `src/components/GameUI/GameUI.css`:

```css
.unlock-btn {
  width: 100%;
  margin-top: var(--space-md);
  font-size: var(--text-lg);
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/GameUI.tsx src/components/GameUI/GameUI.css
git commit -m "feat: add unlock button when progress reaches 100%"
```

---

### Task 4: Add Unlocked Crops List

**Files:**
- Modify: `src/components/GameUI/GameUI.tsx`

**Step 1: Add unlocked crops section above unlock card**

In UpgradesTab function, find where return statement begins (around line 212). Add this BEFORE the existing unlock-card div:

```typescript
// Get unlocked crops (all crops where unlocked is true)
const unlockedCrops = crops.filter(c => c.unlocked);

return (
  <div className="upgrades-tab">
    <h2 className="heading-section">Unlocks</h2>
    
    {unlockedCrops.length > 0 && (
      <div className="unlocked-section">
        <h3 className="unlocked-title">Unlocked Crops</h3>
        <div className="unlocked-list">
          {unlockedCrops.map(crop => (
            <div key={crop.id} className="unlocked-item">
              <span className="unlocked-check">✓</span>
              <span className="unlocked-name">{crop.name}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {/* rest of existing code */}
```

**Step 2: Add CSS for unlocked list**

Add to `src/components/GameUI/GameUI.css`:

```css
.unlocked-section {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.unlocked-title {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.unlocked-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.unlocked-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.unlocked-check {
  color: var(--accent-success);
}
```

**Step 3: Commit**

```bash
git add src/components/GameUI/GameUI.tsx src/components/GameUI/GameUI.css
git commit -m "feat: add unlocked crops list to Upgrades tab"
```

---

### Task 5: Test the Implementation

**Step 1: Run the app**

```bash
npm run dev
```

**Step 2: Verify functionality**

1. Go to Upgrades tab - should see "Unlocked Crops" section with Wheat and Corn
2. Wait for money to reach $5,000 (or add test money)
3. Progress bar should fill to 100%
4. "UNLOCK POTATOES" button should appear
5. Click button - Potatoes should unlock, appear in Unlocked list, next crop (Sugarcane) should show

**Step 3: Run lint**

```bash
npm run lint
```

Expected: No errors

**Step 4: Commit**

```bash
git add .
git commit -m "test: verify unlock functionality works"
```

---

### Task 6: Final Verification

**Step 1: Build the project**

```bash
npm run build
```

Expected: Build succeeds

**Step 2: Commit final**

```bash
git add .
git commit -m "feat: complete upgrades/unlock menu"
```
