import { useState } from 'react';
import { GameState, GameActions, Crop } from '../../types';
import './GameUI.css';

interface GameUIProps {
  state: GameState;
  actions: GameActions;
}

type TabId = 'crops' | 'upgrades' | 'options';

export function GameUI({ state, actions }: GameUIProps) {
  const [activeTab, setActiveTab] = useState<TabId>('crops');

  return (
    <div className="game-ui">
      <Header money={state.money} income={state.incomePerSecond} />
      <div className="game-body">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="game-content">
          {activeTab === 'crops' && (
            <CropsTab 
              crops={state.crops} 
              onBuy={actions.buyCrop} 
              onUpgradeSoil={actions.upgradeSoil}
              money={state.money} 
            />
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

function Header({ money, income }: { money: number; income: number }) {
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

type TabNavProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'crops', label: 'Crops' },
    { id: 'upgrades', label: 'Upgrades' },
    { id: 'options', label: 'Options' },
  ];

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

interface CropsTabProps {
  crops: Crop[];
  onBuy: (cropId: string) => void;
  onUpgradeSoil: (cropId: string) => void;
  money: number;
}

function calculateCost(crop: Crop): number {
  return Math.floor(crop.baseCost * Math.pow(1.15, crop.owned));
}

function calculateIncome(crop: Crop): number {
  const soilMultiplier = 1 + (crop.soilLevel * 0.5);
  return Math.floor(crop.baseIncome * soilMultiplier);
}

function CropsTab({ crops, onBuy, onUpgradeSoil, money }: CropsTabProps) {
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
            <th>SOIL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(crop => {
            const cost = calculateCost(crop);
            const income = calculateIncome(crop);
            const canBuy = crop.unlocked && money >= cost;
            const canUpgradeSoil = crop.unlocked && crop.soilLevel < 5 && money >= crop.soilUpgradeCost;

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
                  {crop.unlocked ? income : '-'}
                </td>
                <td className="crop-soil">
                  {crop.unlocked ? (
                    <span className={`soil-level ${crop.soilLevel >= 5 ? 'maxed' : ''}`}>
                      {crop.soilLevel}/5
                    </span>
                  ) : '-'}
                </td>
                <td className="crop-actions">
                  {crop.unlocked && (
                    <>
                      <button
                        className="btn btn-secondary soil-button"
                        disabled={!canUpgradeSoil}
                        onClick={() => onUpgradeSoil(crop.id)}
                        title={crop.soilLevel >= 5 ? 'Soil maxed' : `Upgrade soil ($${crop.soilUpgradeCost})`}
                      >
                        Soil+
                      </button>
                      <button
                        className="btn btn-primary buy-button"
                        disabled={!canBuy}
                        onClick={() => onBuy(crop.id)}
                      >
                        BUY
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UpgradesTab({ crops }: { crops: Crop[]; upgrades: any[]; money: number }) {
  const nextUnlock = crops.find(c => !c.unlocked && c.unlockCost);

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
        </div>
      ) : (
        <div className="all-unlocked">
          <p>All crops unlocked!</p>
        </div>
      )}
    </div>
  );
}

function OptionsTab({ 
  onSetTheme, 
  onSave, 
  onLoad, 
  onReset, 
  onExport,
  onImport 
}: {
  onSetTheme: (theme: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => string;
  onImport: (data: string) => boolean;
}) {
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
          <option value="classic">Classic</option>
          <option value="retro-terminal">Retro Terminal</option>
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

export { Header, TabNav, CropsTab, UpgradesTab, OptionsTab };
