import { Progress } from "@/components/ui/progress";
import { Enemy } from "@/types/enemy";
import { useState } from "react";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import { generateBouftouBite } from "../utils/gamedesign/enemy-attack-generator";
import { generatePression } from "../utils/gamedesign/player-attack-generator";
import { generateCompulsion } from "../utils/gamedesign/player-boost-generator";
import { playAudio, playErrorSound } from "../utils/music/handleAudio";
import { getRandomInt } from "../utils/tools/getRandomNumber";
import { useStore } from "./store";

export function usePlayingBoard(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
): [boolean, (entity: string) => void, JSX.Element[][]] {
  const board = useStore((state) => state.board);

  const player = useStore((state) => state.player);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);

  const enemy = useStore((state) => state.enemy);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const selectedSpell = useStore((state) => state.selectedSpell);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const attackRangeDisplay = useStore((state) => state.attackRangeDisplay);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );
  const setIsGameOver = useStore((state) => state.setIsGameOver);
  const setIsGameWin = useStore((state) => state.setIsGameWin);
  const turnCount = useStore((state) => state.turnCount);
  const setTurnCount = useStore((state) => state.setTurnCount);
  const boostDuration = useStore((state) => state.boostDuration);
  const setBoostDuration = useStore((state) => state.setBoostDuration);
  const playerOnAttackMode = useStore((state) => state.playerOnAttackMode);
  const setPlayerOnAttackMode = useStore(
    (state) => state.setPlayerOnAttackMode
  );

  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
  const [playerBoostAmont, setPlayerBoostAmont] = useState<number>(0);
  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean>(false);
  const [showEnemyInfo, setShowEnemyInfo] = useState<boolean>(false);

  function passTurn(entity: string) {
    setSelectedSpell(null);
    if (entity === player.name) {
      player.pm = 3;
      player.pa = 6;
      setEnemyInfo("isTurnToPlay", true);
      setPlayerInfo("isTurnToPlay", false);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
    if (entity === enemy.name) {
      if (boostDuration !== undefined) {
        setBoostDuration(boostDuration - 1);
        if (boostDuration === 1) {
          setBoostDuration(undefined);
        }
      }
      setTurnCount(turnCount + 1);
      enemy.pm = 3;
      enemy.pa = 6;
      const audioSource = "./200_fx_69.mp3.mp3";
      playAudio(audioSource, 0.5, false, true);
      setEnemyInfo("isTurnToPlay", false);
      setPlayerInfo("isTurnToPlay", true);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
  }

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      const [keyL, keyR] = key.split("-").map(Number);

      return (
        <div
          key={key}
          className={`size-[3.5dvw] border-2 border-gray-500 hover:cursor-pointer ${
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
                src={player.illustration}
                className={`absolute ${
                  player.isCompulsionAnimated
                    ? "top-[-256%] left-[-162%] h-[383%] max-w-[133%]"
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
                    : `${
                        player.isIllustrationPositionCorrectedUp
                          ? "top-[-90%] left-[-42%]"
                          : player.isIllustrationPositionCorrectedDown
                          ? "top-[-87%] left-[-42%]"
                          : player.isIllustrationPositionCorrectedLeft
                          ? "top-[-82%] left-[-49%]"
                          : "top-[-82%] left-[-42%]"
                      }  h-[180%] max-w-[55%]`
                } transform rotate-[-38deg] skew-x-[16deg] z-50 ${
                  player.isIllustrationReverted
                    ? "transform -scale-x-100"
                    : undefined
                }`}
                onMouseEnter={() => {
                  setShowPlayerInfo(true);
                }}
                onMouseLeave={() => {
                  setShowPlayerInfo(false);
                }}
              />
              {player.damageTaken && (
                <div className="absolute -top-[67%] -left-[142%] -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-3xl z-[999] -rotate-[47deg] skew-x-[8deg] animate-damage-taken-animation">
                  -{player.damageTaken}
                </div>
              )}
              {showPlayerInfo && (
                <div className="absolute top-[-180%] left-[-305%] w-48 h-20 border-2 transform rotate-[-45deg] skew-x-[9deg] flex flex-col justify-center items-center rounded bg-gray-600 gap-4 z-[999] text-white">
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
                }}
                onMouseLeave={() => {
                  setShowEnemyInfo(false);
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
                    <Progress value={enemy.pv} />
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
            <div className="bg-blue-500 size-[3.5dvw] border-2 opacity-35"></div>
          )}
        </div>
      );
    })
  );

  function enemyAttack() {
    if (enemy.pa <= 0) return;

    const bouftouBite = generateBouftouBite();

    if (enemy.pa < bouftouBite.cost) return;

    const distance = calculateDistance(enemy.position, player.position);

    if (distance > bouftouBite.range) {
      addErrorMessage(`La cible est hors de portée`);
    }

    const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
    const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
    const effects = [audio1, audio2];
    const playerDamage = "./player-sound-effects/damage/131_fx_751.mp3.mp3";
    const playerDeath1 = "./player-sound-effects/death/317_fx_584.mp3.mp3";
    const playerDeath2 = "./player-sound-effects/death/316_fx_585.mp3.mp3";

    setPlayerInfo("pv", (player.pv -= bouftouBite.damage!));
    setPlayerInfo("damageTaken", bouftouBite.damage!);

    setTimeout(() => {
      setPlayerInfo("damageTaken", null);
    }, 1100);

    if (player.pv <= 0) {
      playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
      playAudio(playerDeath1, 0.2, false, true);
      setTimeout(() => {
        playAudio(playerDeath2, 0.1, false, true);
        setIsGameOver(true);
      }, 500);
      return;
    }

    playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
    setTimeout(() => {
      playAudio(playerDamage, 0.2, false, true);
    }, 200);

    addInfoMessage(`${enemy.name} lance ${bouftouBite.attackName}.`);
    addInfoMessage(
      `${enemy.name} inflige ${bouftouBite.damage!} points de dommage à ${
        player.name
      }.`
    );

    setEnemyInfo("pa", (enemy.pa -= bouftouBite.cost));
  }

  function playerAttack() {
    if (selectedSpell === null) return;

    const enemyDamageSound1 = "./enemy-sound-effects/damage/209_fx_681.mp3.mp3";
    const enemyDamageSound2 = "./enemy-sound-effects/damage/212_fx_679.mp3.mp3";
    const enemyDamageSounds = [enemyDamageSound1, enemyDamageSound2];
    const playerAttackSoundBefore =
      "./player-sound-effects/attack/165_fx_720.mp3.mp3";
    const playerAttackSoundAfter =
      "./player-sound-effects/attack/pression_attack.mp3";
    const playerAttackSoundAfter2 =
      "./player-sound-effects/attack/pression_attack_2.mp3";
    const playerAttacksAfter = [
      playerAttackSoundAfter,
      playerAttackSoundAfter2,
    ];

    const initialImage = "./player-static/player-static-front-right.png";

    const pression = generatePression();

    const distance = calculateDistance(player.position, enemy.position);

    const position = calculateEnemyPositionComparedToPlayer(
      enemy.position,
      player.position
    );

    switch (selectedSpell.attackName) {
      case "Pression":
        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        if (player.pa < pression.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        if (distance > pression.range) {
          addErrorMessage("la cible est hors de portée");
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        switch (position) {
          case "up":
            setPlayerInfo("isPressionAnimated", true);
            setPlayerInfo("isIllustrationReverted", true);
            setPlayerInfo("isIllustrationPositionCorrectedUp", true);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "down":
            setPlayerInfo("isPressionAnimated", true);
            setPlayerInfo("isIllustrationReverted", true);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", true);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-1.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-front-right.png"
              );
            }, 1000);
            break;
          case "left":
            setPlayerInfo("isPressionAnimated", true);
            setPlayerInfo("isIllustrationReverted", false);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", true);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "right":
            console.log("ici");
            setPlayerInfo("isPressionAnimated", true);
            setPlayerInfo("isIllustrationReverted", false);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-1.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
            }, 1000);
            break;
          default:
            console.log("nothing to do");
            break;
        }

        setTimeout(() => {
          playAudio(playerAttackSoundBefore, 0.1, false, true);
        }, 400);

        setTimeout(() => {
          playAudio(
            playerAttacksAfter[getRandomInt(playerAttacksAfter.length)],
            0.1,
            false,
            true
          );
        }, 400);

        setTimeout(() => {
          playAudio(
            enemyDamageSounds[getRandomInt(enemyDamageSounds.length)],
            0.1,
            false,
            true
          );
        }, 450);

        setEnemyInfo("pv", (enemy.pv -= pression.damage! + playerBoostAmont));

        setTimeout(() => {
          setEnemyInfo("damageTaken", pression.damage! + playerBoostAmont);
        }, 400);

        setTimeout(() => {
          setEnemyInfo("damageTaken", null);
        }, 1400);

        setSelectedSpell(null);
        setPlayerInfo("pa", (player.pa -= pression.cost));
        setAttackRangeDisplay([]);
        addInfoMessage(`${player.name} lance ${pression.attackName}.`);
        addInfoMessage(
          `${player.name} inflige ${
            pression.damage! + playerBoostAmont
          } points de dommage à ${enemy.name}.`
        );
        if (enemy.pv <= 0) {
          const bouftoudeathBefore =
            "./enemy-sound-effects/death/331_fx_571.mp3.mp3";
          const bouftoudeathAfter =
            "./enemy-sound-effects/death/316_fx_585.mp3.mp3";
          console.log("sound 1");
          playAudio(bouftoudeathBefore, 0.3, false, true);
          setTimeout(() => {
            console.log("sound 2");
            playAudio(bouftoudeathAfter, 0.3, false, true);
          }, 500);
          setTimeout(() => {
            console.log("sound 2");
            setIsGameWin(true);
          }, 1500);
        }
        return;
      default:
        console.log("no spell selected");
        setSelectedSpell(null);
        return;
    }
  }

  function playerBoost() {
    if (boostDuration !== undefined) return;
    if (selectedSpell === null) return;
    const boostSoundBefore = "./player-sound-effects/boost/iop_boost.mp3";
    const boostSoundAfter = "./player-sound-effects/boost/233_fx_66.mp3.mp3";
    const distance = calculateDistance(player.position, player.position);
    const compulsion = generateCompulsion();
    const initialImage = player.illustration;

    switch (selectedSpell.attackName) {
      case "Compulsion":
        if (distance > compulsion.range) return;

        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        if (player.pa < compulsion.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        setPlayerInfo("isCompulsionAnimated", true);

        setPlayerInfo(
          "illustration",
          "./player-animations/boost-animation.gif"
        );
        setTimeout(() => {
          setPlayerInfo("illustration", initialImage);
          setPlayerInfo("isCompulsionAnimated", false);
        }, 1000);

        setTimeout(() => {
          playAudio(boostSoundBefore, 0.1, false, true);
        }, 100);

        setTimeout(() => {
          playAudio(boostSoundAfter, 0.1, false, true);
        }, 150);

        setPlayerBoostAmont(compulsion.boost!);
        addInfoMessage(`${player.name} lance ${compulsion.attackName}.`);
        addInfoMessage(
          `${player.name} gagne ${compulsion.boost} points de dommage pendant 5 tours.`
        );
        setBoostDuration(5);
        setSelectedSpell(null);
        setPlayerOnAttackMode(false);
        setAttackRangeDisplay([]);
        setPlayerInfo("pa", (player.pa -= compulsion.cost));

        return;
      default:
        console.log("no spell selected");
        return;
    }
  }

  function selectCell(key: string, currentPlayer: Player | Enemy) {
    if (!player.position || !enemy.position) return;

    let newPath: string[];

    if (player.isTurnToPlay) {
      if (key === enemy.position) {
        if (!playerOnAttackMode) return;
        const distance = calculateDistance(player.position, enemy.position);
        const pression = generatePression();
        if (distance <= pression.range) {
          if (enemy.pv > 0) {
            setCanMove(false);
            playerAttack();
            setPlayerOnAttackMode(false);
            return;
          }
        } else {
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          setPlayerOnAttackMode(false);
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }

      if (key === player.position) {
        if (boostDuration !== undefined) {
          addErrorMessage("Action impossible");
          return;
        }
        playerBoost();
        setSelectedSpell(null);
        return;
      }
      newPath = calculatePath(
        player.position!,
        key,
        currentPlayer.pm,
        enemy.position
      );
    } else {
      if (key === player.position) {
        const distance = calculateDistance(enemy.position, player.position);
        const bouftouBite = generateBouftouBite();
        if (distance <= bouftouBite.range) {
          if (player.pv > 0) {
            enemyAttack();
            return;
          }
        } else {
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }
      newPath = calculatePath(
        enemy.position!,
        key,
        currentPlayer.pm,
        player.position
      );
    }

    if (!canMove) {
      setSelectedSpell(null);
      setAttackRangeDisplay([]);
      setPlayerOnAttackMode(false);
      return;
    }

    if (playerOnAttackMode) {
      setSelectedSpell(null);
      setAttackRangeDisplay([]);
      setPlayerOnAttackMode(false);
      return;
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      if (player.isTurnToPlay) {
        const position = handlePlayerMovementDirection(player.position, key);
        switch (position) {
          case "up":
            setPlayerInfo("isIllustrationReverted", true);
            setPlayerInfo("isIllustrationPositionCorrectedUp", true);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-static/player-static-left.png"
            );
            break;
          case "down":
            setPlayerInfo("isIllustrationReverted", true);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", true);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-static/player-static-front-right.png"
            );
            break;
          case "left":
            setPlayerInfo("isIllustrationReverted", false);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", true);
            setPlayerInfo(
              "illustration",
              "./player-static/player-static-left.png"
            );
            break;
          case "right":
            setPlayerInfo("isIllustrationReverted", false);
            setPlayerInfo("isIllustrationPositionCorrectedUp", false);
            setPlayerInfo("isIllustrationPositionCorrectedDown", false);
            setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
            setPlayerInfo(
              "illustration",
              "./player-static/player-static-front-right.png"
            );
            break;
          default:
            console.log("nothing to do");
            break;
        }
        setPlayerInfo("position", key);
        setPlayerInfo("pm", player.pm - (newPath.length - 1));
      } else {
        setEnemyInfo("position", key);
        setEnemyInfo("pm", enemy.pm - (newPath.length - 1));
      }

      setPath([]);
    } else {
      addErrorMessage(`Action impossible`);
    }
  }

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

  function calculatePath(
    start: string,
    end: string,
    maxLength: number,
    obstacle: string
  ) {
    const [startRow, startCol] = start.split("-").map(Number);
    const [endRow, endCol] = end.split("-").map(Number);
    const queue = [[startRow, startCol]];
    const visited = new Set();
    const cameFrom = new Map();
    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    visited.add(`${startRow}-${startCol}`);

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;

      if (row === endRow && col === endCol) {
        const path = [];
        let current = `${endRow}-${endCol}`;

        while (current !== start) {
          path.push(current);
          current = cameFrom.get(current);
        }
        path.push(start);

        if (path.length - 1 <= maxLength) {
          setCanMove(true);
          return path.reverse();
        } else {
          setCanMove(false);
          return [];
        }
      }

      for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        const key = `${newRow}-${newCol}`;
        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board.width &&
          !visited.has(key) &&
          key !== obstacle
        ) {
          queue.push([newRow, newCol]);
          visited.add(key);
          cameFrom.set(key, `${row}-${col}`);
        }
      }
    }
    return [];
  }

  function calculateDistance(cell1: string, cell2: string): number {
    const [row1, col1] = cell1.split("-").map(Number);
    const [row2, col2] = cell2.split("-").map(Number);
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }

  function addErrorMessage(errorMessage: string) {
    playErrorSound(0.1);
    setMessage((prevMessages) => [
      ...prevMessages,
      {
        type: "Erreur",
        message: errorMessage,
      },
    ]);
  }

  function addInfoMessage(infoMessage: string) {
    setMessage((prevMessages) => [
      ...prevMessages,
      {
        type: "Info",
        message: infoMessage,
      },
    ]);
  }

  function calculateEnemyPositionComparedToPlayer(
    enemyCell: string,
    playerCell: string
  ): string | undefined {
    let position: "left" | "right" | "up" | "down" | undefined;

    const [enemyRow, enemyCol] = enemyCell.split("-").map(Number);
    const [playerRow, playerCol] = playerCell.split("-").map(Number);

    if (enemyRow === playerRow && enemyCol < playerCol) position = "left";
    if (enemyRow > playerRow && enemyCol < playerCol) position = "down";
    if (enemyRow > playerRow && enemyCol === playerCol) position = "down";
    if (enemyRow > playerRow && enemyCol > playerCol) position = "down";
    if (enemyRow === playerRow && enemyCol > playerCol) position = "right";
    if (enemyRow < playerRow && enemyCol > playerCol) position = "right";
    if (enemyRow < playerRow && enemyCol === playerCol) position = "up";
    if (enemyRow < playerRow && enemyCol < playerCol) position = "up";

    return position;
  }

  function handlePlayerMovementDirection(
    playerCell: string,
    targetCell: string
  ): string | undefined {
    let position: "left" | "right" | "up" | "down" | undefined;
    const [playerRow, playerCol] = playerCell.split("-").map(Number);
    const [targetCellRow, targetCellCol] = targetCell.split("-").map(Number);

    if (targetCellRow === playerRow && targetCellCol < playerCol)
      position = "left";
    if (targetCellRow > playerRow && targetCellCol < playerCol)
      position = "down";
    if (targetCellRow > playerRow && targetCellCol === playerCol)
      position = "down";
    if (targetCellRow > playerRow && targetCellCol > playerCol)
      position = "down";
    if (targetCellRow === playerRow && targetCellCol > playerCol)
      position = "right";
    if (targetCellRow < playerRow && targetCellCol > playerCol)
      position = "right";
    if (targetCellRow < playerRow && targetCellCol === playerCol)
      position = "up";
    if (targetCellRow < playerRow && targetCellCol < playerCol) position = "up";

    return position;
  }

  return [isUserImageDisplayed, passTurn, grid];
}
