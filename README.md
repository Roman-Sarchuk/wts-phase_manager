# WTS Phase Manager

A focused single-page application (SPA) for managing game flow, round progression, and phase timing during live board-game sessions.

The project is optimized for facilitator/operator usage with quick phase switching, configurable timers, and persistent session settings without the need for a backend.

## Core Capabilities

**Base Phase Cycle:** Pre-defined cycle (Team → Actions → Diplomacy → End of Turn) with automatic round increments.

**Special Phase Overlays:** Non-cyclic screens for preparation, breaks, or briefings that temporarily override the main view.

**Live Timer Control:** Dynamic countdowns with visual progress bars, color thresholds (Green/Yellow/Orange/Red), and "Time's Up" alerts.

**On-the-fly Configuration:** Edit phase names, descriptions, and durations directly during the session.

**Persistent State:** All game data, including the current round and timer, survives page reloads via local storage.

## Technology Stack

- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 8
- **State Management:** Zustand 5 with persist middleware
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React

## Keyboard Shortcuts

The application supports rapid control via hotkeys (when not typing in input fields):

- **`1`** – Toggle Controls menu
- **`2`** – Toggle Timer menu
- **`3`** – Toggle Settings menu
- **`P`** – Start/Pause timer
- **`Enter`** – Move to the next base phase
- **`Esc`** – Close any open menu

## Project Structure

```
src/
  components/
    layout/      # Header (Controls) and Screen (Display)
    ui/          # Reusable UI primitives
  store/
    useGameStore.ts # Core logic, timer ticking, and persistence
  lib/
    utils.ts     # Tailwind merging and utility functions
```

## Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## State & Persistence

This is a purely client-side application. It uses a single Zustand store with a storage key: `dicecon-phase-storage`. There is no database synchronization; the state is tied to the specific browser instance where it is running.
