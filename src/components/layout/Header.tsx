import { useEffect, useState } from "react";
import logoWts from "@/assets/logo-wts.png";
import logoDicecon from "@/assets/logo-dicecon.png";
import { useGameStore, SPECIAL_PHASES } from "@/store/useGameStore";
import { ChevronRight, ChevronDown, Play, Pause } from "lucide-react"; // іконки з lucide-react

type MenuType = "controls" | "timer" | null;
type SubMenuType = "specialPhases" | "setLeftTime" | "setTimer" | null;

function Header() {
  const {
    round,
    specialPhase,
    currentBasePhase,
    phases,
    timeLeft,
    isRunning,
    nextBasicPhase,
    prevBasicPhase,
    closeSpecialPhase,
    showSpecialPhase,
    toggleTimer,
    setLeftTimer,
    setCurrentPhaseTime,
  } = useGameStore();
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>(null);
  const [leftTimeInput, setLeftTimeInput] = useState("");
  const [setTimerInput, setSetTimerInput] = useState("");
  const [leftTimeError, setLeftTimeError] = useState<string | null>(null);
  const [setTimerError, setSetTimerError] = useState<string | null>(null);

  const activePhase = specialPhase ?? currentBasePhase;
  const maxTimer = activePhase.durationSeconds;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleMenu(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMenu = (menu: MenuType) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    toggleSubMenu(null);
  };

  const toggleSubMenu = (subMenu: SubMenuType) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  const parseSeconds = (value: string) => {
    if (value.trim() === "") return null;

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null;

    return parsed;
  };

  const handleAddLeftTime = () => {
    const seconds = parseSeconds(leftTimeInput);

    if (seconds === null) {
      setLeftTimeError("Введи ціле число секунд.");
      return;
    }

    if (seconds < 0) {
      setLeftTimeError("Не можна ставити менше 0.");
      return;
    }

    if (maxTimer === null || timeLeft === null) {
      setLeftTimeError("Для поточної фази таймер вимкнений.");
      return;
    }

    if (seconds > maxTimer) {
      setLeftTimeError("Не можна ставити більше, ніж значення таймера фази.");
      return;
    }

    setLeftTimer(seconds);
    setLeftTimeError(null);
    setLeftTimeInput("");
  };

  const handleSetTimer = () => {
    const seconds = parseSeconds(setTimerInput);

    if (seconds === null) {
      setSetTimerError("Введи ціле число секунд.");
      return;
    }

    if (seconds < 0) {
      setSetTimerError("Не можна ставити менше 0.");
      return;
    }

    setCurrentPhaseTime(seconds);
    setSetTimerError(null);
    setSetTimerInput("");
  };

  return (
    <header className="relative flex h-20 items-center justify-between bg-[#FFD700] pl-2 pr-5">
      {/* Logos Container */}
      <div className="flex items-center gap-5">
        <img
          src={logoWts}
          alt="Logo-WTS"
          className="h-16 w-auto object-contain"
        />
        <img
          src={logoDicecon}
          alt="Logo-Dicecon"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* round number */}
      <div className="font-smack text-4xl uppercase tracking-widest text-black">
        Раунд: {round}
      </div>

      {/* navigation arrows */}
      <div className="flex gap-2 text-white">
        {/* Button "Screen navigation" */}
        <button
          onClick={() => toggleMenu("timer")}
          className="p-2 hover:opacity-80"
        >
          {activeMenu === "timer" ? (
            <ChevronDown size={48} strokeWidth={4} />
          ) : (
            <ChevronRight size={48} strokeWidth={4} />
          )}
        </button>
        {/* Button "Timer" */}
        <button
          onClick={() => toggleMenu("controls")}
          className="p-2 hover:opacity-80"
        >
          {activeMenu === "controls" ? (
            <ChevronDown size={48} strokeWidth={4} />
          ) : (
            <ChevronRight size={48} strokeWidth={4} />
          )}
        </button>
      </div>

      {/* Modal container */}
      {activeMenu && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute right-5 top-24">
          {/* Controls */}
          {activeMenu === "controls" && (
            <div className="flex flex-col gap-3">
              {/* Menu */}
              <div className="flex gap-4 rounded-xl bg-white p-4 shadow-lg">
                {specialPhase ? (
                  <button
                    onClick={closeSpecialPhase}
                    className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                  >
                    Закрити
                    <br />
                    спец екран
                  </button>
                ) : (
                  <>
                    <button
                      onClick={prevBasicPhase}
                      className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Попередній
                      <br />
                      екран
                    </button>
                    <button
                      onClick={nextBasicPhase}
                      className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Наступний
                      <br />
                      екран
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleSubMenu("specialPhases")}
                  className="flex aspect-square items-center justify-center rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Спец
                  <br />
                  екрани
                </button>
              </div>
              {/* SubMenu */}
              {activeSubMenu === "specialPhases" && (
                <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  {SPECIAL_PHASES.map((phaseId) => (
                    <button
                      key={phases[phaseId].id}
                      onClick={() => {
                        showSpecialPhase(phaseId);
                      }}
                      className={`rounded ${phases[phaseId].color.background} ${phases[phaseId].color.text} px-4 py-3 text-sm font-semibold hover:opacity-90`}
                    >
                      {phases[phaseId].name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timer */}
          {activeMenu === "timer" && (
            <div className="flex flex-col gap-3">
              {/* Menu */}
              <div className="flex gap-4 rounded-xl bg-white p-4 shadow-lg">
                <button
                  onClick={() => {
                    toggleSubMenu("setTimer");
                  }}
                  className="rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Встановити
                  <br />
                  час
                </button>
                <button
                  onClick={() => {
                    toggleSubMenu("setLeftTime");
                  }}
                  className="rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  +час
                </button>
                <button
                  onClick={() => {
                    setLeftTimer(60);
                  }}
                  className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  +1хв
                </button>

                <button
                  onClick={toggleTimer}
                  className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} />}
                </button>
              </div>

              {/* SubMenu - addTime */}
              {activeSubMenu === "setLeftTime" && (
                <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex w-full gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={leftTimeInput}
                      onChange={(event) => {
                        setLeftTimeInput(event.target.value);
                        setLeftTimeError(null);
                      }}
                      placeholder="Секунди"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleAddLeftTime}
                      className="rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Додати
                    </button>
                  </div>
                  {leftTimeError && (
                    <p className="text-sm font-medium text-red-600">{leftTimeError}</p>
                  )}
                </div>
              )}

              {/* SubMenu - setTimer */}
              {activeSubMenu === "setTimer" && (
                <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex w-full gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={setTimerInput}
                      onChange={(event) => {
                        setSetTimerInput(event.target.value);
                        setSetTimerError(null);
                      }}
                      placeholder="Секунди"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleSetTimer}
                      className="rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Встановити
                    </button>
                  </div>
                  {setTimerError && (
                    <p className="text-sm font-medium text-red-600">{setTimerError}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
