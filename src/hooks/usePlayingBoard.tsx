import { useEffect, useState } from "react";
import { BouftouBite } from "../types/attack";
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
  React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
] {
  const [targetedCell, setTargetedCell] = useState<string>("6-1");
  const [enemyCell, setEnemyCell] = useState<string>("1-6");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 6, y: 1 });
  const [enemyPosition, setEnemyPosition] = useState({ x: 1, y: 6 });
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  //const [canPlayerPassTurn, setCanPlayerPassTurn] = useState<boolean>(false);
  //const [canEnemyPassTurn, setCanEnemyPassTurn] = useState<boolean>(false);

  function passTurn(entity: string) {
    if (entity === player.name) {
      player.pm = 3; //TODO: a variabliser
      setTurn(enemy);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
    if (entity === enemy.name) {
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
    const attack1: BouftouBite = {
      dammage: getRandomIntMinMax(5, 25),
    };
    const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
    const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
    const effects = [audio1, audio2];
    const playerDamage = "./player-sound-effects/damage/131_fx_751.mp3.mp3";
    const playerDeath1 = "./player-sound-effects/death/317_fx_584.mp3.mp3";
    const playerDeath2 = "./player-sound-effects/death/316_fx_585.mp3.mp3";

    player.pv -= attack1.dammage;

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

    setMessage((prevMessages) => [
      ...prevMessages,
      {
        type: "Info",
        message: `${enemy.name} inflige ${attack1.dammage} points de dommage à ${player.name}`,
      },
    ]);
  }

  function selectCell(key: string, currentPlayer: Player) {
    if (!targetedCell || !enemyCell) return;

    if (!canMove) {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          type: "Erreur",
          message: `Pas assez de PM`,
        },
      ]);
      return;
    }

    if (turn.name === enemy.name && key === targetedCell) {
      if (player.pv > 0) enemyAttack();
      return;
    }

    if (turn.name === player.name && key === enemyCell) {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          type: "Erreur",
          message: `Action impossible`,
        },
      ]);
      return;
    }

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm, enemyCell);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, targetedCell);
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      setCurrentPath(newPath);
      if (turn.name === player.name) {
        setTargetedCell(key);
        player.pm = player.pm - (newPath.length - 1);
      } else {
        setEnemyCell(key);
      }

      setPath([]);
    } else {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          type: "Erreur",
          message: `Action impossible`,
        },
      ]);
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

  return [
    isUserImageDisplayed,
    playerPosition,
    enemyPosition,
    passTurn,
    grid,
    turn,
    selectCell,
    setMessage,
  ];
}
