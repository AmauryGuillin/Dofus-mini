import { useStore } from "@/hooks/store";
import { useEntityActionsUtils } from "@/hooks/useEntityActionsUtils";
import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";

type Props = {
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
};

export default function Timeline({ setMessage }: Props) {
  const board = useStore((state) => state.board);
  const player = useStore((state) => state.player);
  const enemy = useStore((state) => state.enemy);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const entities: (Player | Enemy)[] = [player, enemy];

  const { calculPMRangeDisplay } = useEntityActionsUtils(setMessage);

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
              } bg-gray-700 flex justify-center items-center transition-all cursor-pointer`}
              onMouseEnter={() => {
                if (player.isTurnToPlay) setEnemyInfo("showInfo", true);
                if (player.isTurnToPlay)
                  calculPMRangeDisplay(enemy, board.width, board.length);
                if (player.isTurnToPlay) setEnemyInfo("showPM", true);
              }}
              onMouseLeave={() => {
                if (player.isTurnToPlay) setEnemyInfo("showInfo", false);
                if (player.isTurnToPlay) setEnemyInfo("showPM", false);
              }}
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
              } bg-gray-700 flex justify-center items-center transition-all cursor-pointer`}
              onMouseEnter={() => {
                if (player.isTurnToPlay) setPlayerInfo("showInfo", true);
                if (player.isTurnToPlay)
                  calculPMRangeDisplay(player, board.width, board.length);
                if (player.isTurnToPlay) setPlayerInfo("showPM", true);
              }}
              onMouseLeave={() => {
                if (player.isTurnToPlay) setPlayerInfo("showInfo", false);
                if (player.isTurnToPlay) setPlayerInfo("showPM", false);
              }}
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
