// import { useState } from 'react'

import "./App.css";
import Header from "@/components/layout/Header";
import Screen from "@/components/layout/Screeen";
import { type Phase, useGameStore } from "./store/useGameStore";

function App() {
  const phase: Phase = {
    id: "team",
    type: "basic",
    name: "Фаза команди",
    description: "Перерва до 15:00",
    durationSeconds: 15,
    color: {
      background: "bg-green-400",
      text: "text-[#000000]",
    },
  };
  const { currentBasePhase, specialPhase } = useGameStore();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Screen phase={specialPhase ? specialPhase : currentBasePhase} />
    </div>
  );
}

export default App;
