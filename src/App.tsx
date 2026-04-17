import { useEffect } from "react";

import "./App.css";
import Header from "@/components/layout/Header";
import Screen from "@/components/layout/Screeen";
import { useGameStore } from "./store/useGameStore";

function App() {
  const { currentBasePhase, specialPhase, isRunning, tick } = useGameStore();

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, tick]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Screen phase={specialPhase ? specialPhase : currentBasePhase} />
    </div>
  );
}

export default App;
