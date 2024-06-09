import { useEffect, useState } from "react";
import { BouftouBite, Pression } from "../types/attack";
import { Board } from "../types/board";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import { playAudio } from "../utils/music/handleAudio";
import {
  getRandomInt,
  getRandomIntMinMax,
} from "../utils/tools/getRandomNumber";

export function usePlayingBoard(
  player: Player,
  enemy: Player,
  board: Board,
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>,
  isGameOver: React.Dispatch<React.SetStateAction<boolean>>
): [
  boolean,
  { [key: string]: number },
  { [key: string]: number },
  (entity: string) => void,
  JSX.Element[][],
  Player,
  (key: string, currentPlayer: Player) => void,
  boolean,
  React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
] {
  const [targetedCell, setTargetedCell] = useState<string>("3-3");
  const [enemyCell, setEnemyCell] = useState<string>("3-4");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
  const [playerPosition, setPlayerPosition] = useState({
    x: Number(targetedCell.charAt(0)),
    y: Number(targetedCell.charAt(2)),
  });
  const [enemyPosition, setEnemyPosition] = useState({
    x: Number(enemyCell.charAt(0)),
    y: Number(enemyCell.charAt(2)),
  });
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [canPlayerPassTurn, setCanPlayerPassTurn] = useState<boolean>(true);

  function passTurn(entity: string) {
    if (entity === player.name) {
      setCanPlayerPassTurn(false);
      player.pm = 3;
      setTurn(enemy);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
    if (entity === enemy.name) {
      setCanPlayerPassTurn(true);
      enemy.pm = 3;
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
            !isMoving && key === targetedCell
              ? "border-4 border-blue-400 rounded-full"
              : !isMoving && key === enemyCell
              ? "border-4 border-red-400 rounded-full"
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
        />
      );
    })
  );

  function enemyAttack() {
    const attack: BouftouBite = {
      attackName: "Morsure du Bouftou",
      dammage: getRandomIntMinMax(5, 25),
      range: 1,
    };

    const distance = calculateDistance(enemyCell, targetedCell);

    if (distance > attack.range) {
      addErrorMessage(`La cible est hors de portée`);
    }

    const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
    const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
    const effects = [audio1, audio2];
    const playerDamage = "./player-sound-effects/damage/131_fx_751.mp3.mp3";
    const playerDeath1 = "./player-sound-effects/death/317_fx_584.mp3.mp3";
    const playerDeath2 = "./player-sound-effects/death/316_fx_585.mp3.mp3";

    player.pv -= attack.dammage;

    if (player.pv <= 0) {
      playAudio(playerDeath1, 0.5, false, true);
      setTimeout(() => {
        playAudio(playerDeath2, 0.5, false, true);
        isGameOver(true);
      }, 500);
      return;
    }

    playAudio(effects[getRandomInt(effects.length)], 0.5, false, true);
    setTimeout(() => {
      playAudio(playerDamage, 0.3, false, true);
    }, 200);

    addInfoMessage(`${enemy.name} lance ${attack.attackName}.`);
    addInfoMessage(
      `${enemy.name} inflige ${attack.dammage} points de dommage à ${player.name}.`
    );
  }

  function playerAttack() {
    const pression: Pression = {
      attackName: "Pression",
      dammage: getRandomIntMinMax(7, 25),
      range: 2,
    };

    const distance = calculateDistance(targetedCell, enemyCell);

    if (distance > pression.range) {
      addErrorMessage("la cible est hors de portée");
    }

    enemy.pv -= pression.dammage;
    addInfoMessage(`${player.name} lance ${pression.attackName}.`);
    addInfoMessage(
      `${player.name} inflige ${pression.dammage} points de dommage à ${enemy.name}.`
    );
  }

  function selectCell(key: string, currentPlayer: Player) {
    if (!targetedCell || !enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      if (key === enemyCell) {
        const distance = calculateDistance(targetedCell, enemyCell);
        if (distance <= 2) {
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
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm, enemyCell);
    } else {
      if (key === targetedCell) {
        const distance = calculateDistance(enemyCell, targetedCell);
        if (distance <= 1) {
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
      setCurrentPath(newPath);
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

  useEffect(() => {
    if (currentPath.length > 0) {
      setIsMoving(true);
      const interval = setInterval(() => {
        setCurrentPath((prevPath) => {
          if (prevPath.length === 0) {
            clearInterval(interval);
            setIsMoving(false);
            return [];
          }

          const nextPosition = prevPath[0].split("-").map(Number);
          if (turn.name === player.name) {
            setPlayerPosition({ x: nextPosition[0], y: nextPosition[1] });
          } else {
            setEnemyPosition({ x: nextPosition[0], y: nextPosition[1] });
          }

          return prevPath.slice(1);
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [currentPath]);

  function calculateDistance(cell1: string, cell2: string): number {
    const [row1, col1] = cell1.split("-").map(Number);
    const [row2, col2] = cell2.split("-").map(Number);
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }

  function addErrorMessage(errorMessage: string) {
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
    playerPosition,
    enemyPosition,
    passTurn,
    grid,
    turn,
    selectCell,
    canPlayerPassTurn,
    setMessage,
  ];
}
