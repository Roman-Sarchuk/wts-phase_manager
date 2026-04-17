import { type Phase, useGameStore } from "@/store/useGameStore";

interface ScreenProps {
  phase: Phase;
}

function Screen({ phase }: ScreenProps) {
  const timeLeft = useGameStore((state) => state.timeLeft);

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
  );
}

export default Screen;
