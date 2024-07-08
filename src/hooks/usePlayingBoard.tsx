import { useState } from "react";
import { BouftouBite, Compulsion, Pression } from "../types/attack";
import { Board } from "../types/board";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import { playAudio, playErrorSound } from "../utils/music/handleAudio";
import {
  getRandomInt,
  getRandomIntMinMax,
} from "../utils/tools/getRandomNumber";
import { useStore } from "./store";

function generateBouftouBite(): BouftouBite {
  return {
    attackName: "Morsure du Bouftou",
    dammage: getRandomIntMinMax(5, 25),
    range: 1,
    cost: 4,
  };
}

function generatePression(): Pression {
  return {
    attackName: "Pression",
    dammage: getRandomIntMinMax(7, 25),
    range: 2,
    cost: 3,
  };
}

function generateCompulsion(): Compulsion {
  return {
    attackName: "Compulsion",
    boost: getRandomIntMinMax(6, 11),
    range: 0,
    cost: 3,
  };
}

export function usePlayingBoard(
  player: Player,
  enemy: Player,
  board: Board,
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>,
  isGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setTurnCount: React.Dispatch<React.SetStateAction<number>>,
  turnCount: number,
  setBoostDuration: React.Dispatch<React.SetStateAction<number | undefined>>,
  boostDuration: number | undefined
): [
  boolean,
  (entity: string) => void,
  JSX.Element[][],
  Player,
  number,
  number | undefined
  //boolean
] {
  const playerCell = useStore((state) => state.playerCell);
  const setPlayerCell = useStore((state) => state.setPlayerCell);

  const selectedSpell = useStore((state) => state.selectedSpell);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);

  const attackRangeDisplay = useStore((state) => state.attackRangeDisplay);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );

  const [enemyCell, setEnemyCell] = useState<string>("1-6");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
  const [playerBoostAmont, setPlayerBoostAmont] = useState<number>(0);
  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean>(false);
  const [showEnemyInfo, setShowEnemyInfo] = useState<boolean>(false);
  //const [canPlayerPassTurn, setCanPlayerPassTurn] = useState<boolean>(true);

  function passTurn(entity: string) {
    setSelectedSpell(null);
    if (entity === player.name) {
      //setCanPlayerPassTurn(false);
      player.pm = 3;
      player.pa = 6;
      setTurn(enemy);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
    if (entity === enemy.name) {
      //setCanPlayerPassTurn(true);
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
      setTurn(player);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
  }

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;

      return (
        <div
          key={key}
          className={`w-24 h-24 border-2 border-gray-500 hover:cursor-pointer ${
            key === playerCell
              ? "border-2 relative"
              : key === enemyCell
              ? "border-2 relative"
              : path.includes(key) && key !== playerCell
              ? "bg-green-500"
              : undefined
          }`}
          onClick={() => {
            if (turn.name === player.name) {
              selectCell(key, player);
            } else {
              selectCell(key, enemy);
            }
          }}
          onMouseEnter={() => enter(key, turn)}
          onMouseLeave={leave}
        >
          {key === playerCell && (
            <>
              <img
                src="./images/player-front-bottom-right.png"
                className="absolute top-[-138%] left-[-101%] h-[232%] max-w-[140%] transform rotate-[-30deg] skew-x-[20deg] z-50"
                onMouseEnter={() => {
                  setShowPlayerInfo(true);
                }}
                onMouseLeave={() => {
                  setShowPlayerInfo(false);
                }}
              />
              {showPlayerInfo && (
                <div className="absolute top-[-176%] left-[-262%] w-48 h-20 border-2 transform rotate-[-38deg] skew-x-[11deg] flex flex-col justify-center items-center rounded bg-gray-600 gap-4">
                  <div>{player.name}</div>
                  <div className="flex justify-center items-center">
                    <progress max="100" value={player.pv}>
                      {player.pv}
                    </progress>
                  </div>
                </div>
              )}
              <div className="absolute border-4 rounded-full border-blue-400 w-full h-full" />
            </>
          )}

          {key === enemyCell && (
            <>
              <img
                src="./images/bouftou.png"
                className="absolute top-[-53%] left-[-27%] h-[165%] max-w-[101%] transform rotate-[-30deg] skew-x-[20deg] z-50"
                onMouseEnter={() => {
                  setShowEnemyInfo(true);
                }}
                onMouseLeave={() => {
                  setShowEnemyInfo(false);
                }}
              />
              {showEnemyInfo && (
                <div className="absolute top-[-220%] left-[-311%] w-48 h-20 border-2 transform rotate-[-38deg] skew-x-[11deg] flex flex-col justify-center items-center rounded bg-gray-600 gap-4">
                  <div>{enemy.name}</div>
                  <div className="flex justify-center items-center">
                    <progress max="100" value={enemy.pv}>
                      {player.pv}
                    </progress>
                  </div>
                </div>
              )}
              <div className="absolute border-4 rounded-full border-red-400 w-full h-full" />
            </>
          )}
          {attackRangeDisplay.includes(key) && (
            <div className="bg-blue-400 w-24 h-24 border-2 opacity-35"></div>
          )}
        </div>
      );
    })
  );

  function enemyAttack() {
    if (enemy.pa <= 0) return;

    const bouftouBite = generateBouftouBite();

    if (enemy.pa < bouftouBite.cost) return;

    const distance = calculateDistance(enemyCell, playerCell);

    if (distance > bouftouBite.range) {
      addErrorMessage(`La cible est hors de portée`);
    }

    const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
    const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
    const effects = [audio1, audio2];
    const playerDamage = "./player-sound-effects/damage/131_fx_751.mp3.mp3";
    const playerDeath1 = "./player-sound-effects/death/317_fx_584.mp3.mp3";
    const playerDeath2 = "./player-sound-effects/death/316_fx_585.mp3.mp3";

    player.pv -= bouftouBite.dammage;

    if (player.pv <= 0) {
      playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
      playAudio(playerDeath1, 0.2, false, true);
      setTimeout(() => {
        playAudio(playerDeath2, 0.1, false, true);
        isGameOver(true);
      }, 500);
      return;
    }

    playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
    setTimeout(() => {
      playAudio(playerDamage, 0.2, false, true);
    }, 200);

    addInfoMessage(`${enemy.name} lance ${bouftouBite.attackName}.`);
    addInfoMessage(
      `${enemy.name} inflige ${bouftouBite.dammage} points de dommage à ${player.name}.`
    );

    enemy.pa -= bouftouBite.cost;
  }

  function playerAttack() {
    if (selectedSpell === null) return;

    const enemyDamageSound1 = "./enemy-sound-effects/damage/209_fx_681.mp3.mp3";
    const enemyDamageSound2 = "./enemy-sound-effects/damage/212_fx_679.mp3.mp3";
    const enemyDamageSounds = [enemyDamageSound1, enemyDamageSound2];
    const playerAttackSoundBefore =
      "./player-sound-effects/attack/165_fx_720.mp3.mp3";
    //const playerAttackSoundAfter = "./player-sound-effects/attack/372_fx_534.mp3.mp3";
    const playerAttackSoundAfter =
      "./player-sound-effects/attack/pression_attack.mp3";
    const playerAttackSoundAfter2 =
      "./player-sound-effects/attack/pression_attack_2.mp3";
    const playerAttacksAfter = [
      playerAttackSoundAfter,
      playerAttackSoundAfter2,
    ];

    const pression = generatePression();

    const distance = calculateDistance(playerCell, enemyCell);

    switch (selectedSpell) {
      case 0:
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
          console.log('"ldkswjfgsodijkô"');
          return;
        }

        //setSelectedSpell(undefined)

        playAudio(playerAttackSoundBefore, 0.1, false, true);
        playAudio(
          playerAttacksAfter[getRandomInt(playerAttacksAfter.length)],
          0.1,
          false,
          true
        );

        setTimeout(() => {
          playAudio(
            enemyDamageSounds[getRandomInt(enemyDamageSounds.length)],
            0.1,
            false,
            true
          );
        }, 50);

        enemy.pv -= pression.dammage + playerBoostAmont;
        setSelectedSpell(null);
        player.pa -= pression.cost;
        setAttackRangeDisplay([]);
        addInfoMessage(`${player.name} lance ${pression.attackName}.`);
        addInfoMessage(
          `${player.name} inflige ${pression.dammage} points de dommage à ${enemy.name}.`
        );
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
    const distance = calculateDistance(playerCell, playerCell);
    const compulsion = generateCompulsion();

    switch (selectedSpell) {
      case 1:
        if (distance > compulsion.range) return;

        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        if (player.pa < compulsion.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }
        playAudio(boostSoundBefore, 0.1, false, true);
        setTimeout(() => {
          playAudio(boostSoundAfter, 0.1, false, true);
        }, 50);

        setPlayerBoostAmont(compulsion.boost);
        addInfoMessage(`${player.name} lance ${compulsion.attackName}.`);
        addInfoMessage(
          `${player.name} gagne ${compulsion.boost} points de dommage pendant 5 tours.`
        );
        setBoostDuration(5);
        setSelectedSpell(null);
        player.pa -= compulsion.cost;
        return;
      default:
        console.log("no spell selected");
        return;
    }
  }

  function selectCell(key: string, currentPlayer: Player) {
    if (!playerCell || !enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      if (key === enemyCell) {
        const distance = calculateDistance(playerCell, enemyCell);
        const pression = generatePression();
        if (distance <= pression.range) {
          if (enemy.pv > 0) {
            setCanMove(false);
            playerAttack();
            return;
          }
        } else {
          setAttackRangeDisplay([]);
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }

      if (key === playerCell) {
        if (boostDuration !== undefined) {
          addErrorMessage("Action impossible");
          return;
        }
        playerBoost();
        setSelectedSpell(null);
        return;
      }
      newPath = calculatePath(playerCell!, key, currentPlayer.pm, enemyCell);
    } else {
      if (key === playerCell) {
        const distance = calculateDistance(enemyCell, playerCell);
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
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, playerCell);
    }

    if (!canMove) {
      addErrorMessage(`Pas assez de PM`);
      return;
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      if (turn.name === player.name) {
        setPlayerCell(key);
        player.pm = player.pm - (newPath.length - 1);
      } else {
        setEnemyCell(key);
        enemy.pm = enemy.pm - (newPath.length - 1);
      }

      setPath([]);
    } else {
      addErrorMessage(`Action impossible`);
    }
  }

  function enter(key: string, currentPlayer: Player) {
    if (!playerCell || !enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(playerCell!, key, currentPlayer.pm, enemyCell);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, playerCell);
    }

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

  return [
    isUserImageDisplayed,
    passTurn,
    grid,
    turn,
    turnCount,
    boostDuration,
    //canPlayerPassTurn,
  ];
}
