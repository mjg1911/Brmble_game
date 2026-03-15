export interface Crop {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  owned: number;
  unlocked: boolean;
  unlockCost?: number;
  soilLevel: number;
  soilUpgradeCost: number;
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
  upgradeSoil: (cropId: string) => void;
  setTheme: (theme: string) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  exportSave: () => string;
  importSave: (data: string) => boolean;
}

export const INITIAL_CROPS: Crop[] = [
  { id: 'wheat', name: 'Wheat', baseCost: 1420, baseIncome: 51, owned: 0, unlocked: true, soilLevel: 0, soilUpgradeCost: 500 },
  { id: 'corn', name: 'Corn', baseCost: 4830, baseIncome: 96, owned: 0, unlocked: true, soilLevel: 0, soilUpgradeCost: 1200 },
  { id: 'potatoes', name: 'Potatoes', baseCost: 11000, baseIncome: 180, owned: 0, unlocked: false, unlockCost: 5000, soilLevel: 0, soilUpgradeCost: 3000 },
  { id: 'carrots', name: 'Carrots', baseCost: 28000, baseIncome: 320, owned: 0, unlocked: false, unlockCost: 15000, soilLevel: 0, soilUpgradeCost: 7500 },
  { id: 'tomatoes', name: 'Tomatoes', baseCost: 65000, baseIncome: 550, owned: 0, unlocked: false, unlockCost: 40000, soilLevel: 0, soilUpgradeCost: 15000 },
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
