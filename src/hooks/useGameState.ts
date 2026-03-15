import { useState, useCallback } from 'react'
import { GameState, GameActions, UseGameStateReturn } from '../types'

const initialState: GameState = {
  money: 100,
  crops: [
    { id: 'wheat', name: 'Wheat', growthTime: 5000, sellPrice: 10 },
    { id: 'corn', name: 'Corn', growthTime: 10000, sellPrice: 25 },
    { id: 'carrot', name: 'Carrot', growthTime: 15000, sellPrice: 40 },
  ],
  animals: [
    { id: 'chicken', name: 'Chicken', productionTime: 8000, sellPrice: 15, owned: 0 },
    { id: 'cow', name: 'Cow', productionTime: 15000, sellPrice: 30, owned: 0 },
    { id: 'sheep', name: 'Sheep', productionTime: 20000, sellPrice: 50, owned: 0 },
  ],
  upgrades: [
    { id: 'speed_boost', name: 'Speed Boost', cost: 100, purchased: false, description: 'Crops grow 50% faster' },
    { id: 'auto_harvest', name: 'Auto Harvest', cost: 500, purchased: false, description: 'Automatically harvest crops' },
  ],
  automationEnabled: false,
}

function useGameState(): UseGameStateReturn {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('farmGameState')
    return saved ? JSON.parse(saved) : initialState
  })

  const saveState = useCallback((newState: GameState) => {
    setState(newState)
    localStorage.setItem('farmGameState', JSON.stringify(newState))
  }, [])

  const actions: GameActions = {
    plantCrop: (cropId: string) => {
      setState(prev => ({
        ...prev,
        crops: prev.crops.map(crop =>
          crop.id === cropId ? { ...crop, plantedAt: Date.now() } : crop
        ),
      }))
    },
    harvestCrop: (cropId: string) => {
      const crop = state.crops.find(c => c.id === cropId)
      if (crop && crop.plantedAt) {
        const elapsed = Date.now() - crop.plantedAt
        if (elapsed >= crop.growthTime) {
          saveState({
            ...state,
            money: state.money + crop.sellPrice,
            crops: state.crops.map(c =>
              c.id === cropId ? { ...c, plantedAt: undefined } : c
            ),
          })
        }
      }
    },
    buyAnimal: (animalId: string) => {
      const animal = state.animals.find(a => a.id === animalId)
      if (animal && state.money >= animal.sellPrice) {
        saveState({
          ...state,
          money: state.money - animal.sellPrice,
          animals: state.animals.map(a =>
            a.id === animalId ? { ...a, owned: a.owned + 1 } : a
          ),
        })
      }
    },
    collectAnimal: (animalId: string) => {
      const animal = state.animals.find(a => a.id === animalId)
      if (animal && animal.owned > 0) {
        saveState({
          ...state,
          money: state.money + animal.sellPrice * animal.owned,
          animals: state.animals.map(a =>
            a.id === animalId ? { ...a, lastCollected: Date.now() } : a
          ),
        })
      }
    },
    purchaseUpgrade: (upgradeId: string) => {
      const upgrade = state.upgrades.find(u => u.id === upgradeId)
      if (upgrade && state.money >= upgrade.cost && !upgrade.purchased) {
        saveState({
          ...state,
          money: state.money - upgrade.cost,
          upgrades: state.upgrades.map(u =>
            u.id === upgradeId ? { ...u, purchased: true } : u
          ),
        })
      }
    },
    toggleAutomation: () => {
      saveState({ ...state, automationEnabled: !state.automationEnabled })
    },
  }

  return { state, actions }
}

export default useGameState
