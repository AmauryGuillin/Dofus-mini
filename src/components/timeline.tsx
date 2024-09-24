import { useStore } from "@/hooks/store";
import { useEntityActionsUtils } from "@/hooks/useEntityActionsUtils";
import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { Fragment } from "react/jsx-runtime";

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

  const playerHealthPercentage = Math.round(
    Math.min(
      (useStore.getState().player.pv / useStore.getState().player.pvMax) * 100,
      100
    )
  );
  const playerTopOffset = 100 - playerHealthPercentage;

  const enemyHealthPercentage = Math.round(
    Math.min(
      (useStore.getState().enemy.pv / useStore.getState().enemy.pvMax) * 100,
      100
    )
  );

  const enemyTopOffset = 100 - enemyHealthPercentage;

  return (
    <>
      {entities.map((entity) => {
        if (entity.type === "Enemy") {
          return (
            <Fragment key={entity.name}>
              <div
                className={`relative w-[3dvw] h-[7dvh] overflow-hidden ${
                  entity.isTurnToPlay
                    ? "border-4 border-[#F66600] rounded-sm"
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
                  className="size-12 z-50"
                />
                <div
                  style={{ top: `${enemyTopOffset}%` }}
                  className={`absolute w-[3dvw] h-[7dvh] bg-red-500 opacity-20`}
                ></div>
              </div>
            </Fragment>
          );
        }

        if (entity.type === "Player") {
          return (
            <Fragment key={entity.name}>
              <div
                key={entity.name}
                className={`relative w-[3dvw] h-[7dvh] overflow-hidden ${
                  entity.isTurnToPlay
                    ? "border-4 border-[#F66600] rounded-sm"
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
                  className="w-[2dvw] h-[6dvh] z-50"
                />
                <div
                  style={{ top: `${playerTopOffset}%` }}
                  className={`absolute w-[3dvw] h-[7dvh] bg-red-500 opacity-20`}
                ></div>
              </div>
            </Fragment>
          );
        }
      })}
    </>
  );
}
