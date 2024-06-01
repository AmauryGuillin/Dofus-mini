import { useState } from "react";
import { Board } from "../types/board";
import { Player } from "../types/player";
import { playAudio } from "../utils/music/handleAudio";
import { getRandomInt } from "../utils/tools/getRandomNumber";
import PlayerInfo from "./player-info";
import PlayerTurnImage from "./player-turn-image";

const player: Player = {
  name: "Skyouuh",
  pv: 100,
  pm: 3,
  pa: 6,
};

const enemy: Player = {
  name: "Bouftou",
  pv: 30,
  pm: 3,
  pa: 6,
};

const board: Board = {
  name: "main",
  width: 8,
  length: 8,
};

export default function PlayingBoard() {
  const [targetedCell, setTargetedCell] = useState<string>("6-1");
  const [enemyCell, setEnemyCell] = useState<string>("1-6");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);
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
      playAudio(audioSource, 0.5);
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
              ? "bg-blue-400"
              : key === enemyCell
              ? "bg-red-400"
              : path.includes(key)
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

  function selectCell(key: string, currentPlayer: Player) {
    if (!targetedCell || !enemyCell) return;

    if (!canMove) {
      console.log("Pas assez de PM");
      return;
    }

    if (turn.name === enemy.name && key === targetedCell) {
      const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
      const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
      const effects = [audio1, audio2];
      playAudio(effects[getRandomInt()], 0.5);
    }

    if (key === enemyCell) {
      console.log("Action impossible");
      return;
    }

    if (key === targetedCell) {
      console.log("Action impossible");
      return;
    }

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm, enemyCell);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm, targetedCell);
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      if (turn.name === player.name) {
        setTargetedCell(key);
        player.pm = player.pm - (newPath.length - 1);
      } else {
        setEnemyCell(key);
      }

      setPath([]);
    } else {
      alert("Pas assez de pm");
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

  return (
    <div className="h-screen flex justify-center items-center w-full text-white relative">
      {isUserImageDisplayed && <PlayerTurnImage player={turn} />}
      <PlayerInfo player={player} />
      <div className="transform-gpu rotate-[30deg] -skew-x-[30deg]">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row}
            </div>
          );
        })}
        <div>
          <button
            type="button"
            className="border-2 w-36 h-12 hover:scale-110 transition-all delay-[10ms] hover:bg-gray-800"
            onClick={() => passTurn(turn.name)}
          >
            Passer le tour
          </button>
        </div>
      </div>
    </div>
  );
}
