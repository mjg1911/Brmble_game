# Upgrades/Unlock Menu Design

**Date:** 2026-03-15

## Problem

The Upgrades tab shows a progress bar that fills up when the player reaches the money threshold to unlock a new crop, but there's no way to actually unlock the crop. The bar just stays at 100% with no action possible.

## Solution

### 1. Add unlockCrop Action (useGameState.ts)

Add a new action to mark a crop as unlocked:

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

Add to GameActions interface and export.

### 2. Update UpgradesTab (GameUI.tsx)

**Two sections:**

1. **Unlocked Crops Section:**
   - Display all crops where `unlocked: true`
   - Each shows with a checkmark icon
   - Scrollable list if many crops

2. **Current Unlock Section:**
   - Find next locked crop with unlockCost
   - Show progress bar (current money / unlock cost)
   - When progress >= 100%, show "UNLOCK" button
   - Button calls `unlockCrop` action

## Files Changed

- `src/hooks/useGameState.ts` - Add unlockCrop action
- `src/components/GameUI/GameUI.tsx` - Update UpgradesTab
