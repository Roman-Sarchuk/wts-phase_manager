import { act, useState } from "react";
import logoWts from "@/assets/logo-wts.png";
import logoDicecon from "@/assets/logo-dicecon.png";
import { useGameStore, SPECIAL_PHASES, PHASES } from "@/store/useGameStore";
import { ChevronRight, ChevronDown } from "lucide-react"; // іконки з lucide-react

type MenuType = "controls" | "settings" | "info" | null;

function Header() {
  const {
    round,
    specialPhase,
    nextBasicPhase,
    prevBasicPhase,
    closeSpecialPhase,
    showSpecialPhase,
  } = useGameStore();
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<boolean>(false);

  const toggleMenu = (menu: MenuType) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    setActiveSubMenu(false);
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
        {/* Button 1 */}
        <button
          onClick={() => toggleMenu("settings")}
          className="p-2 hover:opacity-80"
        >
          {activeMenu === "settings" ? (
            <ChevronDown size={48} strokeWidth={4} />
          ) : (
            <ChevronRight size={48} strokeWidth={4} />
          )}
        </button>
        {/* Button 2 */}
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

      {/* Випадаюче меню (Модалка) */}
      {activeMenu === "controls" && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute right-5 top-24 flex flex-col gap-4">
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
              onClick={() => setActiveSubMenu(!activeSubMenu)}
              className="flex aspect-square items-center justify-center rounded-full bg-gray-300 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-400"
            >
              Спец
              <br />
              екрани
            </button>
          </div>

          {activeSubMenu && (
            <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4 shadow-lg">
              {SPECIAL_PHASES.map((phaseId) => (
                <button
                  key={PHASES[phaseId].id}
                  onClick={() => {showSpecialPhase(phaseId)}}
                  className={`rounded ${PHASES[phaseId].color.background} ${PHASES[phaseId].color.text} px-4 py-3 text-sm font-semibold hover:opacity-90`}
                >
                  {PHASES[phaseId].name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
