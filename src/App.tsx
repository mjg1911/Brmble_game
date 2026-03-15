import { useGameState } from './hooks/useGameState'
import { GameUI } from './components/GameUI/GameUI'
import './index.css'
import './themes/classic.css'
import './themes/retro-terminal.css'

const STORAGE_KEY = 'idle-farm-theme';

function getStoredTheme(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'classic' || stored === 'retro-terminal') {
    return stored;
  }
  return 'classic';
}

function initTheme() {
  const theme = getStoredTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

initTheme();

function App() {
  const { state, actions } = useGameState()
  
  return (
    <div className="app">
      <GameUI state={state} actions={actions} />
    </div>
  )
}

export default App
