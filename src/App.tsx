import { useState } from 'react'
import GameUI from './components/GameUI/GameUI'
import useGameState from './hooks/useGameState'

function App() {
  const { state, actions } = useGameState()

  return <GameUI state={state} actions={actions} />
}

export default App
