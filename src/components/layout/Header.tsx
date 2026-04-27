import { useEffect, useState } from "react";
import logoWts from "@/assets/logo-wts.png";
import logoDicecon from "@/assets/logo-dicecon.png";
import logoMaisterniaRolovyka from "@/assets/logo-maisternia_rolovyka.png";
import { useGameStore, SPECIAL_PHASES, PHASES } from "@/store/useGameStore";
import { Play, Pause } from "lucide-react"; // іконки з lucide-react
import ArrowButton from "@/components/ui/ArrowButton";

type MenuType = "controls" | "timer" | "settings" | null;
type SubMenuType =
  | "specialPhases"
  | "setLeftTime"
  | "setTimer"
  | "setDescription"
  | "setTitle"
  | null;

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
    updatePhase,
  } = useGameStore();
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>(null);
  const [leftMinutesInput, setLeftMinutesInput] = useState("");
  const [leftSecondsInput, setLeftSecondsInput] = useState("");
  const [setTimerMinutesInput, setSetTimerMinutesInput] = useState("");
  const [setTimerSecondsInput, setSetTimerSecondsInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [leftTimeError, setLeftTimeError] = useState<string | null>(null);
  const [setTimerError, setSetTimerError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const activePhase = specialPhase ?? currentBasePhase;
  const maxTimer = activePhase.durationSeconds;
  const isTimerEnabled = activePhase.durationSeconds !== null;

  const toggleSubMenu = (subMenu: SubMenuType) => {
    const nextSubMenu = activeSubMenu === subMenu ? null : subMenu;
    setActiveSubMenu(nextSubMenu);

    if (nextSubMenu === "setTitle") {
      setTitleInput(activePhase.name);
      setTitleError(null);
    }

    if (nextSubMenu === "setDescription") {
      setDescriptionInput(activePhase.description ?? "");
      setDescriptionError(null);
    }
  };

  const toggleMenu = (menu: MenuType) => {
    setActiveMenu((currentMenu) => (currentMenu === menu ? null : menu));
    setActiveSubMenu(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "Escape") {
        setActiveMenu(null);
        setActiveSubMenu(null);
        return;
      }

      if (event.key === "1") {
        setActiveMenu((currentMenu) =>
          currentMenu === "controls" ? null : "controls",
        );
        setActiveSubMenu(null);
        return;
      }

      if (event.key === "2") {
        setActiveMenu((currentMenu) => (currentMenu === "timer" ? null : "timer"));
        setActiveSubMenu(null);
        return;
      }

      if (event.key === "3") {
        setActiveMenu((currentMenu) =>
          currentMenu === "settings" ? null : "settings",
        );
        setActiveSubMenu(null);
      }

      if (event.key.toLowerCase() === "p") {
        toggleTimer();
      }

      if (event.key === "Enter") {
        nextBasicPhase();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextBasicPhase, toggleTimer]);

  const parseTimeInput = (minutes: string, seconds: string) => {
    if (minutes.trim() === "") minutes = "0";
    if (seconds.trim() === "") seconds = "0";

    const parsedMinutes = Number(minutes);
    const parsedSeconds = Number(seconds);

    if (
      !Number.isFinite(parsedMinutes) ||
      !Number.isInteger(parsedMinutes) ||
      !Number.isFinite(parsedSeconds) ||
      !Number.isInteger(parsedSeconds)
    ) {
      return null;
    }

    if (parsedMinutes < 0 || parsedSeconds < 0 || parsedSeconds > 59) {
      return null;
    }

    return parsedMinutes * 60 + parsedSeconds;
  };

  const handleAddLeftTime = () => {
    const seconds = parseTimeInput(leftMinutesInput, leftSecondsInput);

    if (seconds === null) {
      setLeftTimeError("Введи коректні хвилини та секунди (0-59).");
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
    setLeftMinutesInput("");
    setLeftSecondsInput("");
  };

  const handleSetTimer = () => {
    const seconds = parseTimeInput(setTimerMinutesInput, setTimerSecondsInput);

    if (seconds === null) {
      setSetTimerError("Введи коректні хвилини та секунди (0-59).");
      return;
    }

    if (seconds < 0) {
      setSetTimerError("Не можна ставити менше 0.");
      return;
    }

    setCurrentPhaseTime(seconds);
    setSetTimerError(null);
    setSetTimerMinutesInput("");
    setSetTimerSecondsInput("");
  };

  const handleResetAllToDefault = () => {
    const phaseIds = Object.keys(phases) as Array<keyof typeof phases>;

    phaseIds.forEach((phaseId) => {
      const defaultPhase = PHASES[phaseId];

      updatePhase(phaseId, {
        name: defaultPhase.name,
        description: defaultPhase.description,
        durationSeconds: defaultPhase.durationSeconds,
        color: defaultPhase.color,
      });
    });

    setTitleError(null);
    setDescriptionError(null);
  };

  const handleResetCurrentToDefault = () => {
    const phaseId = activePhase.id;
    const defaultPhase = PHASES[phaseId];

    updatePhase(phaseId, {
      name: defaultPhase.name,
      description: defaultPhase.description,
      durationSeconds: defaultPhase.durationSeconds,
      color: defaultPhase.color,
    });

    if (activeSubMenu === "setTitle") {
      setTitleInput(defaultPhase.name);
    }

    if (activeSubMenu === "setDescription") {
      setDescriptionInput(defaultPhase.description ?? "");
    }

    setTitleError(null);
    setDescriptionError(null);
  };

  const handleSetTitle = () => {
    const normalizedTitle = titleInput.trim();

    if (!normalizedTitle) {
      setTitleError("Заголовок не може бути порожнім.");
      return;
    }

    updatePhase(activePhase.id, { name: normalizedTitle });
    setTitleError(null);
  };

  const handleSetDescription = () => {
    const normalizedDescription = descriptionInput.trim();

    updatePhase(activePhase.id, {
      description: normalizedDescription ? normalizedDescription : null,
    });
    setDescriptionError(null);
  };

  const handleTogglePhaseTimer = () => {
    if (isTimerEnabled) {
      setCurrentPhaseTime(null);
      setSetTimerMinutesInput("");
      setSetTimerSecondsInput("");
      setSetTimerError(null);
      return;
    }

    const fallbackDuration = PHASES[activePhase.id].durationSeconds ?? 60;
    setCurrentPhaseTime(fallbackDuration);
    setSetTimerMinutesInput(String(Math.floor(fallbackDuration / 60)));
    setSetTimerSecondsInput(String(fallbackDuration % 60));
    setSetTimerError(null);
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
        {import.meta.env.VITE_FEATURE_DICECON_LOGO == "true" && (
          <img
          src={logoDicecon}
          alt="Logo-Dicecon"
          className="h-16 w-auto object-contain"
        />)}
        {import.meta.env.VITE_FEATURE_MAISTERNIA_ROLOVYKA_LOGO == "true" && (
          <img
            src={logoMaisterniaRolovyka}
            alt="Logo-Maisternia-Rolovyka"
            className="h-16 w-auto object-contain"
          />
        )}
      </div>

      {/* round number */}
      <div className="font-smack text-4xl uppercase tracking-widest text-black">
        Раунд: {round}
      </div>

      {/* navigation arrows */}
      <div className="flex gap-2 text-white">
        <ArrowButton
          active={activeMenu === "settings"}
          func={() => toggleMenu("settings")}
        />
        <ArrowButton
          active={activeMenu === "timer"}
          func={() => toggleMenu("timer")}
        />
        <ArrowButton
          active={activeMenu === "controls"}
          func={() => toggleMenu("controls")}
        />
      </div>

      {/* =-=-= Modal container =-=-= */}
      {activeMenu && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute right-5 top-24">
          {/* --- Controls --- */}
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

          {/* --- Timer --- */}
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
                  <div className="flex w-full flex-row justify-between gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={leftMinutesInput}
                      onChange={(event) => {
                        setLeftMinutesInput(event.target.value);
                        setLeftTimeError(null);
                      }}
                      placeholder="Хв"
                      className="w-0 min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={1}
                      value={leftSecondsInput}
                      onChange={(event) => {
                        setLeftSecondsInput(event.target.value);
                        setLeftTimeError(null);
                      }}
                      placeholder="Сек"
                      className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleAddLeftTime}
                      className="shrink-0 rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Додати
                    </button>
                  </div>
                  {leftTimeError && (
                    <p className="text-sm font-medium text-red-600">
                      {leftTimeError}
                    </p>
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
                      value={setTimerMinutesInput}
                      onChange={(event) => {
                        setSetTimerMinutesInput(event.target.value);
                        setSetTimerError(null);
                      }}
                      placeholder="Хв"
                      className="w-0 min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={1}
                      value={setTimerSecondsInput}
                      onChange={(event) => {
                        setSetTimerSecondsInput(event.target.value);
                        setSetTimerError(null);
                      }}
                      placeholder="Сек"
                      className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleSetTimer}
                      className="shrink-0 rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Встановити
                    </button>
                  </div>
                  {setTimerError && (
                    <p className="text-sm font-medium text-red-600">
                      {setTimerError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- Settings --- */}
          {activeMenu === "settings" && (
            <div className="flex flex-col gap-3">
              {/* Menu */}
              <div className="flex gap-4 rounded-xl bg-white p-4 shadow-lg">
                <button
                  onClick={handleResetAllToDefault}
                  className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Встановити стандартні
                  <br />
                  значення для всього
                </button>

                <button
                  onClick={handleResetCurrentToDefault}
                  className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Встановити стандартні
                  <br />
                  значення тут
                </button>

                <button
                  onClick={() => toggleSubMenu("setTitle")}
                  className="rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Встановити
                  <br />
                  заголовок
                </button>

                <button
                  onClick={() => toggleSubMenu("setDescription")}
                  className="rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  Встановити
                  <br />
                  опис
                </button>

                <button
                  onClick={handleTogglePhaseTimer}
                  className="rounded bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
                >
                  {isTimerEnabled ? "Вимкнути" : "Увімкнути"}
                  <br />
                  таймер
                </button>
              </div>

              {/* SubMenu - setDescription */}
              {activeSubMenu === "setDescription" && (
                <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={descriptionInput}
                      onChange={(event) => {
                        setDescriptionInput(event.target.value);
                        setDescriptionError(null);
                      }}
                      placeholder="Опис (порожньо = без опису)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleSetDescription}
                      className="shrink-0 rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Зберегти
                    </button>
                  </div>
                  {descriptionError && (
                    <p className="text-sm font-medium text-red-600">
                      {descriptionError}
                    </p>
                  )}
                </div>
              )}

              {/* SubMenu - setTitle */}
              {activeSubMenu === "setTitle" && (
                <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(event) => {
                        setTitleInput(event.target.value);
                        setTitleError(null);
                      }}
                      placeholder="Новий заголовок"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black outline-none focus:border-gray-500"
                    />
                    <button
                      onClick={handleSetTitle}
                      className="shrink-0 rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-400"
                    >
                      Зберегти
                    </button>
                  </div>
                  {titleError && (
                    <p className="text-sm font-medium text-red-600">{titleError}</p>
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
