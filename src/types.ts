export interface Crop {
  id: string
  name: string
  growthTime: number
  sellPrice: number
  plantedAt?: number
  ready?: boolean
}

export interface Animal {
  id: string
  name: string
  productionTime: number
  sellPrice: number
  owned: number
  lastCollected?: number
}

export interface Upgrade {
  id: string
  name: string
  cost: number
  purchased: boolean
  description: string
}

export interface GameState {
  money: number
  crops: Crop[]
  animals: Animal[]
  upgrades: Upgrade[]
  automationEnabled: boolean
}

export interface GameActions {
  plantCrop: (cropId: string) => void
  harvestCrop: (cropId: string) => void
  buyAnimal: (animalId: string) => void
  collectAnimal: (animalId: string) => void
  purchaseUpgrade: (upgradeId: string) => void
  toggleAutomation: () => void
}

export interface UseGameStateReturn {
  state: GameState
  actions: GameActions
}
