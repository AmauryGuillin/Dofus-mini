import { useState } from "react";
import { BouftouBite, Pression } from "../types/attack";
import { Board } from "../types/board";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import { playAudio, playErrorSound } from "../utils/music/handleAudio";
import {
  getRandomInt,
  getRandomIntMinMax,
} from "../utils/tools/getRandomNumber";

const bouftouBite: BouftouBite = {
  attackName: "Morsure du Bouftou",
  dammage: getRandomIntMinMax(5, 25),
  range: 1,
  cost: 4,
};

const pression: Pression = {
  attackName: "Pression",
  dammage: getRandomIntMinMax(7, 25),
  range: 2,
  cost: 3,
};

export function usePlayingBoard(
  player: Player,
  enemy: Player,
  board: Board,
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>,
  isGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>,
  selectedSpell: number | undefined
): [
  boolean,
  (entity: string) => void,
  JSX.Element[][],
  Player
  //boolean
] {
  const [targetedCell, setTargetedCell] = useState<string>("3-3");
  const [enemyCell, setEnemyCell] = useState<string>("3-4");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
  //const [canPlayerPassTurn, setCanPlayerPassTurn] = useState<boolean>(true);

  function passTurn(entity: string) {
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
            key === targetedCell
              ? "border-2 relative"
              : key === enemyCell
              ? "border-2 relative"
              : path.includes(key) && key !== targetedCell
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
          {key === targetedCell && (
            <>
              <img
                src="./images/player-front-bottom-right.png"
                className="absolute top-[-138%] left-[-101%] h-[232%] max-w-[140%] transform rotate-[-30deg] skew-x-[20deg] z-50"
              />
              <div className="absolute border-4 rounded-full border-blue-400 w-full h-full" />
            </>
          )}

          {key === enemyCell && (
            <>
              <img
                src="./images/bouftou.png"
                className="absolute top-[-53%] left-[-27%] h-[165%] max-w-[101%] transform rotate-[-30deg] skew-x-[20deg] z-50"
              />
              <div className="absolute border-4 rounded-full border-red-400 w-full h-full" />
            </>
          )}
        </div>
      );
    })
  );

  function enemyAttack() {
    if (enemy.pa <= 0) return;
    if (enemy.pa < bouftouBite.cost) return;

    const distance = calculateDistance(enemyCell, targetedCell);

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
    if (selectedSpell === undefined) return;

    const enemyDamageSound1 = "./enemy-sound-effects/damage/209_fx_681.mp3.mp3";
    const enemyDamageSound2 = "./enemy-sound-effects/damage/212_fx_679.mp3.mp3";
    const enemyDamageSounds = [enemyDamageSound1, enemyDamageSound2];
    const playerAttackSoundBefore =
      "./player-sound-effects/attack/165_fx_720.mp3.mp3";
    const playerAttackSoundAfter =
      "./player-sound-effects/attack/372_fx_534.mp3.mp3";

    const distance = calculateDistance(targetedCell, enemyCell);

    switch (selectedSpell) {
      case 0:
        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        if (player.pa < pression.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        if (distance > pression.range) {
          addErrorMessage("la cible est hors de portée");
          return;
        }

        playAudio(playerAttackSoundBefore, 0.1, false, true);
        playAudio(playerAttackSoundAfter, 0.1, false, true);

        setTimeout(() => {
          playAudio(
            enemyDamageSounds[getRandomInt(enemyDamageSounds.length)],
            0.1,
            false,
            true
          );
        }, 50);

        enemy.pv -= pression.dammage;
        addInfoMessage(`${player.name} lance ${pression.attackName}.`);
        addInfoMessage(
          `${player.name} inflige ${pression.dammage} points de dommage à ${enemy.name}.`
        );
        setSelectedSpell(undefined);
        player.pa -= pression.cost;
        return;
      default:
        console.log("no spell selected");
        return;
    }
  }

  // function playerBoost() {
  //   if (selectedSpell === undefined) return;
  //   const distance = calculateDistance(targetedCell, targetedCell);
  //   console.log("distance", distance);
  // }

  function selectCell(key: string, currentPlayer: Player) {
    if (!targetedCell || !enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      if (key === enemyCell) {
        const distance = calculateDistance(targetedCell, enemyCell);
        if (distance <= pression.range) {
          if (enemy.pv > 0) {
            setCanMove(true);
            playerAttack();
            return;
          }
        } else {
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }

      if (key === targetedCell) {
        //playerBoost();
        return;
      }
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm, enemyCell);
    } else {
      if (key === targetedCell) {
        const distance = calculateDistance(enemyCell, targetedCell);
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
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, targetedCell);
    }

    if (!canMove) {
      addErrorMessage(`Pas assez de PM`);
      return;
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      if (turn.name === player.name) {
        setTargetedCell(key);
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
    if (!targetedCell || !enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm, enemyCell);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, targetedCell);
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
    //canPlayerPassTurn,
  ];
}
