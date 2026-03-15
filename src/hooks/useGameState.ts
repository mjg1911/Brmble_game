import { useState, useEffect, useCallback } from 'react';
import { GameState, GameActions, INITIAL_STATE, Crop } from '../types';

const STORAGE_KEY = 'idle-farm-save';

function calculateIncome(crops: Crop[]): number {
  return crops.reduce((total, crop) => {
    if (!crop.unlocked) return total;
    const soilMultiplier = 1 + (crop.soilLevel * 0.5);
    return total + (crop.baseIncome * crop.owned * soilMultiplier);
  }, 0);
}

function getNextUnlock(crops: Crop[]): Crop | null {
  const locked = crops.find(c => !c.unlocked && c.unlockCost);
  return locked || null;
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

  useEffect(() => {
    const income = calculateIncome(state.crops);
    setState(prev => ({ ...prev, incomePerSecond: income }));
  }, [state.crops]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

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
      const crop = prev.crops.find(c => c.id === cropId);
      if (!crop || !crop.unlocked) return prev;

      const cost = Math.floor(crop.baseCost * Math.pow(1.15, crop.owned));
      if (prev.money < cost) return prev;

      const newCrops = prev.crops.map(c => {
        if (c.id !== cropId) return c;
        return { ...c, owned: c.owned + 1 };
      });

      const newCropsWithUnlocks = newCrops.map(c => {
        if (c.unlockCost && prev.money >= c.unlockCost && !c.unlocked) {
          return { ...c, unlocked: true };
        }
        return c;
      });

      return {
        ...prev,
        crops: newCropsWithUnlocks,
        money: prev.money - cost,
      };
    });
  }, []);

  const upgradeSoil = useCallback((cropId: string) => {
    setState(prev => {
      const crop = prev.crops.find(c => c.id === cropId);
      if (!crop || !crop.unlocked || crop.soilLevel >= 5) return prev;
      if (prev.money < crop.soilUpgradeCost) return prev;

      return {
        ...prev,
        crops: prev.crops.map(c => {
          if (c.id !== cropId) return c;
          return {
            ...c,
            soilLevel: c.soilLevel + 1,
            soilUpgradeCost: Math.floor(c.soilUpgradeCost * 1.5),
          };
        }),
        money: prev.money - crop.soilUpgradeCost,
      };
    });
  }, []);

  const setTheme = useCallback((theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('idle-farm-theme', theme);
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
    upgradeSoil,
    setTheme,
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave,
  };

  const nextUnlock = getNextUnlock(state.crops);

  return {
    state,
    actions,
    nextUnlock,
  };
}
