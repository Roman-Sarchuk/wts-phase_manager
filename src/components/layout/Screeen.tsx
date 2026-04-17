import { useEffect, useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { type Phase, useGameStore } from "@/store/useGameStore";

interface ScreenProps {
  phase: Phase;
}

function Screen({ phase }: ScreenProps) {
  const timeLeft = useGameStore((state) => state.timeLeft);
  const [isTimeUpAlertDismissed, setIsTimeUpAlertDismissed] = useState(false);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && isTimeUpAlertDismissed) {
      const timeoutId = window.setTimeout(() => {
        setIsTimeUpAlertDismissed(false);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [timeLeft, isTimeUpAlertDismissed]);

  const showTimeUpAlert = timeLeft === 0 && !isTimeUpAlertDismissed;

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const phaseDuration = phase.durationSeconds;
  const normalizedTimeLeft =
    phaseDuration === null ? null : (timeLeft ?? phaseDuration);

  const progressPercentage =
    phaseDuration !== null && normalizedTimeLeft !== null && phaseDuration > 0
      ? (normalizedTimeLeft / phaseDuration) * 100
      : 0;

  const bgProgressColor =
    progressPercentage > 50
      ? "bg-progress-green" // green
      : progressPercentage > 25
        ? "bg-progress-yellow" // yellow
        : progressPercentage > 13
          ? "bg-progress-orange" // orange
          : "bg-progress-red"; // red

  return (
    <>
      <main className={`${phase.color.background} flex flex-1 flex-col p-8`}>
        <div className="flex flex-1 items-center justify-center">
          <h1 className={`${phase.color.text} text-center text-9xl`}>
            {phase.name}
          </h1>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-4xl flex-col items-center gap-3">
            {phase.description && (
              <p className={`${phase.color.text} text-center text-4xl`}>
                {phase.description}
              </p>
            )}

            {phase.durationSeconds !== null && normalizedTimeLeft !== null && (
              <div className="flex w-full flex-col items-center gap-3">
                <div className="flex w-full items-center justify-center">
                  <p
                    className={`${phase.color.text} text-center text-5xl`}
                  >
                    {formatTime(normalizedTimeLeft)} / {formatTime(phase.durationSeconds)}
                  </p>
                </div>

                <div className="h-10 w-full overflow-hidden rounded-[3px] bg-[#D9D9D9]">
                  <div
                    className={`${bgProgressColor} h-full rounded-[3px] transition-all duration-300 ease-linear`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showTimeUpAlert && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center fade-in zoom-in duration-300 bg-black/70 backdrop-blur-md">
          <div className="relative flex flex-col items-center justify-center rounded-3xl border-8 border-red-600 bg-[#FFD700] p-16 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 text-red-600"
              onClick={() => setIsTimeUpAlertDismissed(true)}
              aria-label="Close time up alert"
            >
              <X size={48} />
            </button>

            <TriangleAlert className="h-[40vh] w-[40vh] animate-pulse text-red-600" />

            <p className="mt-8 text-center text-[100px] font-smack font-bold uppercase tracking-widest text-black">
              ЧАС ВИЧЕРПАНО!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Screen;
