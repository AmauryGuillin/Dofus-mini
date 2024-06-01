import { Player } from "../types/player";

type Props = {
  player: Player;
};

export default function PlayerTurnImage({ player }: Props) {
  return (
    <div className="absolute top-4 left-8 w-48 h-[253px] bg-gray-300 rounded-lg">
      <div className="animate-slideInFromLeft delay-500">
        <div className="text-black font-bold text-xl pl-2">{player.name}</div>
      </div>
      <div className="animate-slideInFromLeft">
        {player.name !== "Bouftou" ? (
          <img src="./images/1.png" className="animate-slideInFromLeft" />
        ) : (
          <img src="./images/bouftou.png" className="animate-slideInFromLeft" />
        )}
      </div>
    </div>
  );
}
