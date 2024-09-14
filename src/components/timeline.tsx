import { useStore } from "@/hooks/store";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";

export default function Timeline() {
  const player = useStore((state) => state.player);
  const enemy = useStore((state) => state.enemy);

  const entities: (Player | Enemy)[] = [player, enemy];

  return (
    <>
      {entities.map((entity) => {
        if (entity.type === "Enemy") {
          return (
            <div
              key={entity.name}
              className={`w-[3dvw] h-[7dvh] ${
                entity.isTurnToPlay
                  ? "border-4 border-red-400"
                  : "border-2 border-white"
              } bg-gray-700 flex justify-center items-center transition-all`}
            >
              <img
                src={entity.portraitIllustration}
                alt="entity illustration"
                className="size-12"
              />
            </div>
          );
        }

        if (entity.type === "Player") {
          return (
            <div
              key={entity.name}
              className={`w-[3dvw] h-[7dvh] ${
                entity.isTurnToPlay
                  ? "border-4 border-red-400"
                  : "border-2 border-white"
              } bg-gray-700 flex justify-center items-center transition-all`}
            >
              <img
                src={entity.portraitIllustration}
                alt="entity illustration"
                className="w-[2dvw] h-[6dvh]"
              />
            </div>
          );
        }
      })}
    </>
  );
}
