[![CI Pipeline](https://github.com/Roman-Sarchuk/wts-phase_manager/actions/workflows/ci.yml/badge.svg)](https://github.com/Roman-Sarchuk/wts-phase_manager/actions/workflows/ci.yml)
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

> **Live demo:** https://wts-phase-manager.netlify.app/

<img src="https://github.com/user-attachments/assets/73614e94-577b-46a3-9ee0-6a5892422206" width="100%">


<br/>


| | |
| :-: | :-: |
| <img src="https://github.com/user-attachments/assets/de509612-8362-4a5d-b63a-b1012984467b" width="100%"> | <img src="https://github.com/user-attachments/assets/f9efd355-bac3-4a12-8b9d-f683035acbff" width="100%"> |
| <img src="https://github.com/user-attachments/assets/29695b3b-da06-489f-a54a-0da7eca1c8ad" width="100%"> | <img width="100%" alt="Main Screen" src="https://github.com/user-attachments/assets/7afadc26-a7d1-4ada-9550-39f9af88774c" /> |


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
├─ .env                         # Environment variables & feature toggles
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

### 🎛️ Environment Configuration

The application uses **feature toggles** via environment variables to dynamically control which logos and UI elements are displayed. No external services needed—just update your `.env` file.

```env
VITE_FEATURE_DICECON_LOGO = true                    # Enable **DiceCon** logo
VITE_FEATURE_MAISTERNIA_ROLOVYKA_LOGO = false       # Enable **Майстерня Рольовика** logo
```

These variables are loaded at build time and control the visibility of branding elements. To change which logos appear:

1. Edit `.env`
2. Restart the dev server or rebuild
3. The selected logos will now display in the header

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
