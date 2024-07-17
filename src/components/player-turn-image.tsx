import { useStore } from "@/hooks/store";

export default function PlayerTurnImage() {
  const player = useStore((state) => state.player);
  const enemy = useStore((state) => state.enemy);

  return (
    <div className="absolute top-4 left-8 w-48 h-[253px] bg-gray-300 rounded-lg">
      <div className="animate-slideInFromLeft delay-500">
        {player.isTurnToPlay ? (
          <div className="text-black font-bold text-xl pl-2">{player.name}</div>
        ) : (
          <div className="text-black font-bold text-xl pl-2">{enemy.name}</div>
        )}
      </div>
      <div className="animate-slideInFromLeft">
        {player.isTurnToPlay ? (
          <img src="./images/1.png" className="animate-slideInFromLeft" />
        ) : (
          <img src="./images/bouftou.png" className="animate-slideInFromLeft" />
        )}
      </div>
    </div>
  );
}
