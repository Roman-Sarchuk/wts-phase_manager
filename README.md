[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-000000?logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

# 🎮 WTS Phase Manager

A focused single-page application (SPA) for managing game flow, round progression, and phase timing during live board-game sessions.

The project is optimized for facilitator/operator usage with quick phase switching, configurable timers, and persistent session settings without the need for a backend.

---

## 📸 Project Preview

> 👉 **Add your screenshots here**

```
[Screenshot of main phase display]
[Screenshot of controls menu]
[Screenshot of timer interface]
```

---

## ✨ Core Capabilities

🔄 **Base Phase Cycle:** Pre-defined cycle (Team → Actions → Diplomacy → End of Turn) with automatic round increments.

🎭 **Special Phase Overlays:** Non-cyclic screens for preparation, breaks, or briefings that temporarily override the main view.

⏱️ **Live Timer Control:** Dynamic countdowns with visual progress bars, color thresholds (Green/Yellow/Orange/Red), and "Time's Up" alerts.

⚙️ **On-the-fly Configuration:** Edit phase names, descriptions, and durations directly during the session.

💾 **Persistent State:** All game data, including the current round and timer, survives page reloads via local storage.

---

## 🛠 Technology Stack

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)

![Zustand](https://img.shields.io/badge/Zustand-State%20Management-000000?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?logo=tailwind-css&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide%20React-Icons-EF4444?logo=lucide&logoColor=white)

---

## ⌨️ Keyboard Shortcuts

The application supports rapid control via hotkeys (when not typing in input fields):

- **`1`** – Toggle Controls menu
- **`2`** – Toggle Timer menu
- **`3`** – Toggle Settings menu
- **`P`** – Start/Pause timer
- **`Enter`** – Move to the next base phase
- **`Esc`** – Close any open menu

---

## 📂 Project Structure

```
wts-phase_manager/
├─ src/
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Header.tsx          # Operator controls & configuration panels
│  │  │  └─ Screeen.tsx         # Main phase display & timer UI
│  │  └─ ui/
│  │     ├─ ArrowButton.tsx     # Menu toggle arrows
│  │     └─ button.tsx          # Reusable button primitive
│  ├─ store/
│  │  └─ useGameStore.ts        # Zustand state, timer logic & persistence
│  ├─ lib/
│  │  └─ utils.ts               # Utility helpers (Tailwind merge, etc.)
│  ├─ App.tsx                   # Main composition & ticking interval
│  ├─ main.tsx                  # React entry point
│  └─ index.css                 # Tailwind + theme variables + custom fonts
├─ public/
│  └─ fonts/                    # Local custom font assets
├─ vite.config.ts               # Build configuration
├─ tailwind.config.js           # Styling configuration
├─ tsconfig.json                # TypeScript configuration
├─ eslint.config.js             # Linting configuration
└─ package.json                 # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Roman-Sarchuk/wts-phase_manager.git
cd wts-phase_manager
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

---

## 💾 State & Persistence

This is a purely client-side application. It uses a single Zustand store with a storage key: `wts-phase-storage`. There is no database synchronization; the state is tied to the specific browser instance where it is running.
