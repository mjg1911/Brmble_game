import { GameState, GameActions } from '../types'

interface GameUIProps {
  state: GameState
  actions: GameActions
}

function GameUI({ state, actions }: GameUIProps) {
  return (
    <div>
      <h1>Idle Farm Game</h1>
      <p>Money: ${state.money}</p>
    </div>
  )
}

export default GameUI
