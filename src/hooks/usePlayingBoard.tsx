import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ChatInfoMessage } from "../types/chat-info-message";
import { useStore } from "./store";
import { useEntityActions } from "./useEntityActions";
import { useEntityActionsUtils } from "./useEntityActionsUtils";
import { usePassTurn } from "./usePassTurn";
import { useSelectCell } from "./useSelectCell";

export function usePlayingBoard(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
): [boolean, (entity: string) => void, JSX.Element[][]] {
  const board = useStore((state) => state.board);

  const player = useStore((state) => state.player);

  const enemy = useStore((state) => state.enemy);

  const attackRangeDisplay = useStore((state) => state.attackRangeDisplay);

  const pmRangeDisplay = useStore((state) => state.pmRangeDisplay);

  const playerOnAttackMode = useStore((state) => state.playerOnAttackMode);

  const path = useStore((state) => state.path);
  const setPath = useStore((state) => state.setPath);

  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean>(false);
  const [showEnemyInfo, setShowEnemyInfo] = useState<boolean>(false);
  const [showPlayerPM, setShowPlayerPM] = useState<boolean>(false);
  const [showEnemyPM, setShowEnemyPM] = useState<boolean>(false);

  const { isUserImageDisplayed, passTurn } = usePassTurn();

  useEntityActions(setMessage);

  const { calculPMRangeDisplay, calculatePath } =
    useEntityActionsUtils(setMessage);

  const { selectCell } = useSelectCell(setMessage);

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      const [keyL, keyR] = key.split("-").map(Number);

      return (
        <div
          key={key}
          className={`size-[3.5dvw] 2xl:size-[2.5dvw] border-2 border-gray-500 hover:cursor-pointer ${
            key === player.position
              ? "border-2 relative"
              : key === enemy.position
              ? "border-2 relative"
              : path.includes(key) && key !== player.position
              ? "bg-green-500"
              : (keyL + keyR) % 2 == 0
              ? "bg-gray-800"
              : (keyL + keyR) % 2 != 0
              ? "bg-gray-700"
              : undefined
          }`}
          onClick={() => {
            if (player.isTurnToPlay) {
              selectCell(key, player);
            } else {
              selectCell(key, enemy);
            }
          }}
          onMouseEnter={() => enter(key)}
          onMouseLeave={leave}
        >
          {key === player.position && (
            <>
              <img
                id="target"
                src={player.illustration}
                className={`absolute ${
                  player.isCompulsionAnimated
                    ? `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-261%] left-[-148%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-245%] left-[-171%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-238%] left-[-185%]"
                          : "top-[-256%] left-[-162%]"
                      }   h-[383%] max-w-[133%]`
                    : player.isPressionAnimated
                    ? `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-121%] left-[-144%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-137%] left-[-122%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-143%] left-[-115%]"
                          : "top-[-122%] left-[-130%]"
                      }   h-[254%] max-w-[200%]`
                    : player.isAttacked && !player.isDead
                    ? `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-149%] left-[-144%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-167%] left-[-122%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-166%] left-[-118%]"
                          : "top-[-152%] left-[-139%]"
                      } h-[268%] max-w-[155%]`
                    : player.isDead
                    ? `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-243%] left-[-222%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-226%] left-[-231%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-247%] left-[-213%]"
                          : "top-[-252%] left-[-201%]"
                      }   h-[383%] max-w-[254%]`
                    : `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-90%] left-[-42%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-87%] left-[-42%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-82%] left-[-49%]"
                          : "top-[-82%] left-[-42%]"
                      }  h-[180%] max-w-[55%]`
                } transform rotate-[-38deg] skew-x-[16deg] z-50
                ${
                  player.isIllustrationReverted
                    ? "transform -scale-x-100"
                    : undefined
                }`}
                onMouseEnter={() => {
                  setShowPlayerInfo(true);
                  calculPMRangeDisplay(player, board.width, board.length);
                  setShowPlayerPM(true);
                }}
                onMouseLeave={() => {
                  setShowPlayerInfo(false);
                  setShowPlayerPM(false);
                }}
              />
              {player.damageTaken && (
                <div className="absolute -top-[67%] -left-[142%] -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-3xl z-[999] -rotate-[47deg] skew-x-[8deg] animate-damage-taken-animation">
                  -{player.damageTaken}
                </div>
              )}
              {showPlayerInfo && (
                <div className="absolute top-[-268%] left-[-470%] w-48 h-20 border-2 transform rotate-[-45deg] skew-x-[9deg] flex flex-col justify-center items-center rounded bg-gray-600 gap-4 z-[999] text-white">
                  <div>{player.name}</div>
                  <div className="flex justify-center items-center z-10">
                    <Progress value={player.pv} />
                  </div>
                </div>
              )}
              <div className="absolute border-4 rounded-full border-blue-400 w-full h-full z-10" />
              {(keyL + keyR) % 2 == 0 && (
                <div className="absolute bg-gray-800 w-full h-full"></div>
              )}
              {(keyL + keyR) % 2 != 0 && (
                <div className="absolute bg-gray-700 w-full h-full"></div>
              )}
            </>
          )}

          {key === enemy.position && (
            <>
              <img
                src={enemy.illustration}
                className="absolute top-[-53%] left-[-27%] h-[165%] max-w-[101%] transform rotate-[-44deg] skew-x-[8deg] z-50"
                onMouseEnter={() => {
                  setShowEnemyInfo(true);
                  calculPMRangeDisplay(enemy, board.width, board.length);
                  setShowEnemyPM(true);
                }}
                onMouseLeave={() => {
                  setShowEnemyInfo(false);
                  setShowEnemyPM(false);
                }}
              />
              {enemy.damageTaken && (
                <div className="absolute -top-[29%] -left-[61%] -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-3xl z-[999] -rotate-[47deg] skew-x-[8deg] animate-damage-taken-animation">
                  -{enemy.damageTaken}
                </div>
              )}
              {showEnemyInfo && (
                <div className="absolute top-[-216%] left-[-381%] w-48 h-20 border-2 transform rotate-[-45deg] skew-x-[9deg] flex flex-col justify-center items-center rounded bg-gray-600 gap-4 z-[999] text-white">
                  <div>{enemy.name}</div>
                  <div className="flex justify-center items-center">
                    <Progress value={enemy.pv} max={300} />
                  </div>
                </div>
              )}
              <div className="absolute border-4 rounded-full border-red-400 w-full h-full z-10" />
              {(keyL + keyR) % 2 == 0 && (
                <div className="absolute bg-gray-800 w-full h-full"></div>
              )}
              {(keyL + keyR) % 2 != 0 && (
                <div className="absolute bg-gray-700 w-full h-full"></div>
              )}
            </>
          )}
          {attackRangeDisplay.includes(key) && (
            <div className="bg-blue-500 size-[3.5dvw] 2xl:size-[2.5dvw] border-2 opacity-35"></div>
          )}
          {showPlayerPM &&
            !playerOnAttackMode &&
            pmRangeDisplay.includes(key) && (
              <div className="bg-green-500 size-[3.5dvw] 2xl:size-[2.5dvw] border-2 opacity-35"></div>
            )}
          {showEnemyPM &&
            !playerOnAttackMode &&
            pmRangeDisplay.includes(key) && (
              <div className="bg-green-500 size-[3.5dvw] 2xl:size-[2.5dvw] border-2 opacity-35"></div>
            )}
        </div>
      );
    })
  );

  function enter(key: string) {
    if (!player.position || !enemy.position) return;

    let newPath: string[];

    if (player.isTurnToPlay && !playerOnAttackMode) {
      newPath = calculatePath(player.position!, key, player.pm, enemy.position);
      setPath(newPath);
      return;
    }

    if (enemy.isTurnToPlay) {
      newPath = calculatePath(enemy.position!, key, enemy.pm, player.position);
      setPath(newPath);
      return;
    }

    newPath = [];
    setPath(newPath);
  }

  function leave() {
    setPath([]);
  }

  return [isUserImageDisplayed, passTurn, grid];
}
