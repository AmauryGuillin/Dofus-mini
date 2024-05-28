import { useEffect, useState } from "react";
import { Board } from "../types/board";
import { Player } from "../types/player";
import PlayerInfo from "./player-info";

export default function PlayingBoard() {
  const [targetedCell, setTargetedCell] = useState<string>();
  const [path, setPath] = useState<string[]>([]);

  const board: Board = {
    name: "main",
    width: 4,
    length: 4,
  };

  const player: Player = {
    name: "PLAYER_NAME",
    pv: 100,
    pm: 3,
    pa: 6,
  };

  useEffect(() => {
    setTargetedCell("3-0");
  }, []);

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      return (
        <div
          key={key}
          className={`w-24 h-24 border-2 border-gray-500 hover:cursor-pointer ${
            key === targetedCell
              ? "bg-blue-400"
              : path.includes(key)
              ? "bg-green-500"
              : undefined
          }`}
          onClick={() => selectCell(key)}
          onMouseEnter={() => enter(key)}
          onMouseLeave={leave}
        />
      );
    })
  );

  function selectCell(key: string) {
    setTargetedCell(key);
    setPath([]);
  }

  function enter(key: string) {
    const newPath = calculatePath(targetedCell!, key, player.pm);
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
          return path.reverse();
        } else {
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
    <div className="h-screen flex justify-center items-center border-2 w-full text-white relative">
      <PlayerInfo player={player} />
      <div className="transform-gpu rotate-[30deg] -skew-x-[30deg]">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
