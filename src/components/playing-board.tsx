import { useEffect, useState } from "react";
import { Board } from "../types/board";
import { Player } from "../types/player";
import PlayerInfo from "./player-info";

export default function PlayingBoard() {
  const player: Player = {
    name: "Skyouuh",
    pv: 100,
    pm: 3,
    pa: 6,
  };

  const enemy: Player = {
    name: "BOUFTOU",
    pv: 30,
    pm: 3,
    pa: 6,
  };

  const [targetedCell, setTargetedCell] = useState<string>("6-1");
  const [enemyCell, setEnemyCell] = useState<string>("1-6");
  const [path, setPath] = useState<string[]>([]);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [turn, setTurn] = useState<Player>(player);
  //const [canPlayerPassTurn, setCanPlayerPassTurn] = useState<boolean>(false);
  //const [canEnemyPassTurn, setCanEnemyPassTurn] = useState<boolean>(false);
  const test = "./combat_music.mp3";

  useEffect(() => {
    if (test) {
      const music = new Audio("./combat_music.mp3");
      music.play();
    }
  }, []);

  const board: Board = {
    name: "main",
    width: 8,
    length: 8,
  };

  function passTurn(entity: string) {
    console.log(turn);

    if (entity === player.name) {
      setTurn(enemy);
    }
    if (entity === enemy.name) {
      setTurn(player);
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
              console.log("player select cell");
              selectCell(key, player);
            } else {
              console.log(turn, player);
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
    if (!targetedCell) return;

    if (!canMove) {
      alert("Pas assez de PM");
      return;
    }

    if (key === enemyCell) {
      alert("Action impossible");
      return;
    }

    if (key === targetedCell) {
      alert("Action impossible");
      return;
    }

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm);
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      turn.name === player.name ? setTargetedCell(key) : setEnemyCell(key);
      setPath([]);
    } else {
      alert("Pas assez de pm");
    }
  }

  function enter(key: string, currentPlayer: Player) {
    if (!targetedCell) return;
    if (!enemyCell) return;

    let newPath: string[];

    if (turn.name === player.name) {
      newPath = calculatePath(targetedCell!, key, currentPlayer.pm);
    } else {
      newPath = calculatePath(enemyCell!, key, currentPlayer.pm);
    }

    setPath(newPath);
  }

  function leave() {
    setPath([]);
  }

  function calculatePath(
    start: string,
    end: string,
    maxLength: number
  ): string[] {
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
          !visited.has(key)
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
            className="border-2 w-36 h-12"
            onClick={() => passTurn(turn.name)}
          >
            Passer le tour
          </button>
        </div>
      </div>
    </div>
  );
}
