# Brmble Template & System Architecture

This document describes Brmble's architecture patterns to guide implementation of new features like an idle-game.

---

## 1. Architecture Overview

Brmble is a modular desktop voice chat application built with:

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + TypeScript + Vite | UI components, state management |
| Bridge | WebView2 (C# ↔ JS) | Bidirectional message passing |
| Client | C# (Win32 + WebView2) | Native window, audio, system integration |
| Backend | ASP.NET Core | Server-side features (auth, Matrix, Mumble) |

The architecture follows a **service-oriented pattern** where the C# client exposes services via the bridge, and the frontend consumes them through message passing.

---

## 2. The Service Pattern (C# Client)

### 2.1 IService Interface

All client services implement `IService` (`src/Brmble.Client/Bridge/IService.cs`):

```csharp
public interface IService
{
    string ServiceName { get; }
    void Initialize(NativeBridge bridge);
    void RegisterHandlers(NativeBridge bridge);
}
```

### 2.2 Service Structure

Services are organized in `src/Brmble.Client/Services/`:

```
Services/
├── AppConfig/
│   └── AppConfigService.cs      # Settings persistence
├── Certificate/
│   └── CertificateService.cs    # TLS certificate management
├── Serverlist/
│   └── ServerlistService.cs    # Server list management
└── Voice/
    ├── VoiceService.cs         # Voice service interface
    └── MumbleAdapter.cs        # Mumble protocol implementation
```

### 2.3 Creating a New Service

To create an idle-game service:

1. **Create the service directory**: `src/Brmble.Client/Services/IdleGame/`

2. **Create the service class** implementing `IService`:

```csharp
using Brmble.Client.Bridge;

namespace Brmble.Client.Services.IdleGame;

public sealed class IdleGameService : IService
{
    public string ServiceName => "idle";

    private NativeBridge? _bridge;

    public void Initialize(NativeBridge bridge)
    {
        _bridge = bridge;
    }

    public void RegisterHandlers(NativeBridge bridge)
    {
        bridge.RegisterHandler("idle.start", HandleStart);
        bridge.RegisterHandler("idle.earn", HandleEarn);
        bridge.RegisterHandler("idle.upgrade", HandleUpgrade);
        bridge.RegisterHandler("idle.save", HandleSave);
        bridge.RegisterHandler("idle.load", HandleLoad);
    }

    private Task HandleStart(JsonElement data)
    {
        // Initialize game state
        return Task.CompletedTask;
    }

    private Task HandleEarn(JsonElement data)
    {
        // Process resource earning
        return Task.CompletedTask;
    }

    private Task HandleUpgrade(JsonElement data)
    {
        // Process upgrade purchase
        return Task.CompletedTask;
    }

    private Task HandleSave(JsonElement data)
    {
        // Save game to disk
        return Task.CompletedTask;
    }

    private Task HandleLoad(JsonElement data)
    {
        // Load game from disk
        return Task.CompletedTask;
    }
}
```

3. **Register the service in Program.cs** (`src/Brmble.Client/Program.cs`):

```csharp
// Add field
private static IdleGameService? _idleGameService;

// In InitWebView2Async, after bridge creation:
_idleGameService = new IdleGameService();
_idleGameService.Initialize(_bridge);
_idleGameService.RegisterHandlers(_bridge);
```

### 2.4 Message Protocol

Services use service-prefixed namespacing:

| Pattern | Direction | Purpose |
|---------|-----------|---------|
| `{service}.{action}` | JS → C# | Request from frontend |
| `{service}.{result}` | C# → JS | Response to request |
| `{service}.{event}` | C# → JS | Unsolicited event |

For idle-game, use the `idle.` prefix:

```
idle.start        → Start new game
idle.earned       ← Resources earned (periodic)
idle.upgraded     ← Upgrade purchased
idle.error        ← Error occurred
idle.save         → Save game state
idle.load         → Load game state
idle.state        ← Full state sync
```

---

## 3. The Bridge (JavaScript Side)

### 3.1 Bridge API

The frontend uses `bridge.ts` (`src/Brmble.Web/src/bridge.ts`):

```typescript
// Send message to C#
bridge.send('idle.start', { /* data */ });

// Receive messages from C#
bridge.on('idle.earned', (data) => {
  console.log('Earned:', data);
});

// Remove handler
bridge.off('idle.earned', handler);
```

### 3.2 Bridge Message Format

Messages are JSON objects with `type` and optional `data`:

```typescript
// C# sends:
bridge.Send("idle.earned", new { currency = 100, total = 1000 });

// JS receives:
bridge.on('idle.earned', (data: any) => {
  // data = { currency: 100, total: 1000 }
});
```

### 3.3 Integrating Bridge Handlers in App.tsx

In `src/Brmble.Web/src/App.tsx`, add handlers in a `useEffect`:

```tsx
useEffect(() => {
  // Game state handlers
  bridge.on('idle.earned', handleIdleEarned);
  bridge.on('idle.upgraded', handleIdleUpgraded);
  bridge.on('idle.state', handleIdleState);
  bridge.on('idle.error', handleIdleError);

  return () => {
    bridge.off('idle.earned', handleIdleEarned);
    bridge.off('idle.upgraded', handleIdleUpgraded);
    bridge.off('idle.state', handleIdleState);
    bridge.off('idle.error', handleIdleError);
  };
}, []);
```

---

## 4. Theme & Template System

### 4.1 Two-Layer Token System

Brmble uses CSS custom properties at two levels:

#### Global Tokens (`src/Brmble.Web/src/index.css`)

41 tokens for foundational values:

| Category | Tokens | Example |
|----------|--------|---------|
| Spacing | `--space-2xs` to `--space-3xl` | 4px - 64px |
| Font sizes | `--text-2xs` to `--text-4xl` | 10px - 40px |
| Typography | `--font-display`, `--font-body`, `--font-mono` | Font families |
| Transitions | `--transition-fast/normal/slow` | 150ms/250ms/400ms |
| Animations | `--animation-*` | Various loop animations |

#### Per-Theme Tokens (`src/Brmble.Web/src/themes/_template.css`)

73 tokens per theme for colors and effects:

| Category | Count | Prefix |
|----------|-------|--------|
| Backgrounds | 12 | `--bg-*` |
| Primary accent | 7 | `--accent-primary*` |
| Text | 7 | `--text-*` |
| Borders/effects | 2 | `--border-*` |
| Glass | 3 | `--glass-*` |
| Shadows | 3 | `--shadow-*` |
| Glow | 3 | `--glow-*` |
| Border radius | 6 | `--radius-*` |

### 4.2 Using Tokens

**Always use tokens, never hardcode values:**

```css
/* Good */
.game-container {
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  color: var(--text-primary);
  box-shadow: var(--shadow-elevated);
}

/* Bad */
.game-container {
  background: #2a2a35;
  border-radius: 8px;
  padding: 16px;
  color: #f5f0e8;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
```

### 4.3 Heading System

Three-tier heading system (`src/Brmble.Web/src/styles/headings.css`):

| Tier | Class | Element | Use |
|------|-------|---------|-----|
| Title | `.heading-title` | `<h2>` | Page titles, modal titles |
| Section | `.heading-section` | `<h3>` | Uppercase section headers |
| Label | `.heading-label` | `<h4>` | Sidebar labels |

### 4.4 Creating Idle-Game UI

Follow these patterns from `docs/UI_GUIDE.md`:

#### Modal Pattern

```
div.modal-overlay
  div.game-modal.glass-panel.animate-slide-up
    button.modal-close
    h2.heading-title.modal-title
    [game content]
    div.game-modal-footer
```

#### Settings Tab Pattern

```
div.idle-game-tab
  div.settings-section
    h3.heading-section.settings-section-title
    div.settings-item
    div.settings-item.settings-toggle
    div.settings-item.settings-slider
```

---

## 5. Frontend Component Architecture

### 5.1 Component Location

UI components live in `src/Brmble.Web/src/components/`:

```
components/
├── Header/
├── Sidebar/
├── ChatPanel/
├── ConnectModal/
├── SettingsModal/
├── IdleGame/        ← New idle-game components
│   ├── IdleGame.tsx
│   ├── IdleGame.css
│   ├── GamePanel/
│   ├── UpgradePanel/
│   └── StatsDisplay/
```

### 5.2 State Management

For idle-game state, create a custom hook:

```tsx
// src/Brmble.Web/src/hooks/useIdleGame.ts
import { useState, useCallback, useEffect } from 'react';
import bridge from '../bridge';

interface IdleGameState {
  currency: number;
  currencyPerSecond: number;
  upgrades: Record<string, number>;
  lastSaved: number;
}

export function useIdleGame() {
  const [gameState, setGameState] = useState<IdleGameState>({
    currency: 0,
    currencyPerSecond: 0,
    upgrades: {},
    lastSaved: Date.now(),
  });

  const startGame = useCallback(() => {
    bridge.send('idle.start');
  }, []);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    bridge.send('idle.upgrade', { upgradeId });
  }, []);

  const saveGame = useCallback(() => {
    bridge.send('idle.save', gameState);
  }, [gameState]);

  useEffect(() => {
    const handleState = (data: any) => setGameState(data);
    const handleEarned = (data: any) => {
      setGameState(prev => ({
        ...prev,
        currency: data.total,
        currencyPerSecond: data.perSecond,
      }));
    };

    bridge.on('idle.state', handleState);
    bridge.on('idle.earned', handleEarned);

    return () => {
      bridge.off('idle.state', handleState);
      bridge.off('idle.earned', handleEarned);
    };
  }, []);

  return { gameState, startGame, purchaseUpgrade, saveGame };
}
```

### 5.3 Component Integration

Add the idle-game panel to `App.tsx`:

```tsx
import { IdleGame } from './components/IdleGame/IdleGame';

function App() {
  // ... existing state
  
  const { gameState, startGame, purchaseUpgrade, saveGame } = useIdleGame();

  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="main-content">
        {showIdleGame && (
          <IdleGame
            state={gameState}
            onPurchase={purchaseUpgrade}
            onSave={saveGame}
          />
        )}
        {/* ... other panels */}
      </main>
    </div>
  );
}
```

---

## 6. Data Persistence

### 6.1 AppConfigService Pattern

The `AppConfigService` handles settings persistence. For idle-game:

```csharp
public class IdleGameService : IService
{
    private readonly string _savePath;

    public IdleGameService()
    {
        var appData = Environment.GetFolderPath(
            Environment.SpecialFolder.LocalApplicationData);
        var brmbleDir = Path.Combine(appData, "Brmble");
        Directory.CreateDirectory(brmbleDir);
        _savePath = Path.Combine(brmbleDir, "idle-game.json");
    }

    private void SaveGameState(IdleGameState state)
    {
        var json = JsonSerializer.Serialize(state);
        File.WriteAllText(_savePath, json);
    }

    private IdleGameState? LoadGameState()
    {
        if (!File.Exists(_savePath)) return null;
        var json = File.ReadAllText(_savePath);
        return JsonSerializer.Deserialize<IdleGameState>(json);
    }
}
```

### 6.2 Auto-Save

Implement periodic auto-save:

```csharp
private System.Threading.Timer? _autoSaveTimer;

public void Initialize(NativeBridge bridge)
{
    // Auto-save every 30 seconds
    _autoSaveTimer = new System.Threading.Timer(
        _ => SaveGameState(_currentState),
        null,
        TimeSpan.FromSeconds(30),
        TimeSpan.FromSeconds(30));
}
```

---

## 7. Implementation Checklist

### C# Client Side

- [ ] Create `src/Brmble.Client/Services/IdleGame/IdleGameService.cs`
- [ ] Implement `IService` interface
- [ ] Define message handlers for all game actions
- [ ] Implement save/load to local JSON file
- [ ] Add field to `Program.cs`
- [ ] Initialize and register service in `InitWebView2Async`

### Frontend Side

- [ ] Create `src/Brmble.Web/src/hooks/useIdleGame.ts`
- [ ] Create `src/Brmble.Web/src/components/IdleGame/`
- [ ] Implement game UI components with token-based styling
- [ ] Add bridge handlers in `App.tsx`
- [ ] Add game state to App (or use hook)
- [ ] Create upgrade definitions
- [ ] Implement periodic update handler

### Testing

- [ ] Verify save/load persistence
- [ ] Test with multiple themes (especially Retro Terminal)
- [ ] Verify reduced-motion preference
- [ ] Test window resize behavior

---

## 8. Reference Files

| Purpose | Path |
|---------|------|
| Service interface | `src/Brmble.Client/Bridge/IService.cs` |
| Native bridge | `src/Brmble.Client/Bridge/NativeBridge.cs` |
| Service example | `src/Brmble.Client/Services/Voice/VoiceService.cs` |
| Service example | `src/Brmble.Client/Services/AppConfig/AppConfigService.cs` |
| Client entry | `src/Brmble.Client/Program.cs` |
| JS bridge | `src/Brmble.Web/src/bridge.ts` |
| Global tokens | `src/Brmble.Web/src/index.css` |
| Theme template | `src/Brmble.Web/src/themes/_template.css` |
| UI guide | `docs/UI_GUIDE.md` |
| Heading styles | `src/Brmble.Web/src/styles/headings.css` |
| Main app | `src/Brmble.Web/src/App.tsx` |
