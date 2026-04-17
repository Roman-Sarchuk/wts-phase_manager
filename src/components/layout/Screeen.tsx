import { type Phase } from "@/store/useGameStore";
import { useEffect, useState } from "react";

interface ScreenProps {
  phase: Phase;
}

function Screen({ phase }: ScreenProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setElapsedSeconds(0);

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newValue = prev + 1;
        return phase.durationSeconds && newValue > phase.durationSeconds
          ? phase.durationSeconds
          : newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase.durationSeconds]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const progressPercentage = phase.durationSeconds
    ? 100 - (elapsedSeconds / phase.durationSeconds) * 100
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

          {phase.durationSeconds && (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex w-full items-center justify-center">
                <p
                  className={`${phase.color.text} text-center text-5xl`}
                >
                  {formatTime(elapsedSeconds)} /{" "}
                  {formatTime(phase.durationSeconds)}
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
  );
}

export default Screen;
