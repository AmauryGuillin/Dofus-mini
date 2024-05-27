import { useEffect, useState } from "react";
import { Board } from "../types/board";

export default function PlayingBoard() {
  const [targetedCell, setTargetedCell] = useState<string>();
  const board: Board = {
    name: "main",
    width: 4,
    length: 4,
  };

  useEffect(() => {
    setTargetedCell("3-0");
  }, []);

  function selectCell(key: string) {
    setTargetedCell(key);
    console.log(targetedCell);
  }

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      return (
        <div
          key={key}
          className={`w-24 h-24 border-2 border-gray-500 hover:bg-gray-400 ${
            key === targetedCell ? "bg-red-500" : undefined
          }`}
          onClick={() => selectCell(key)}
        />
      );
    })
  );

  console.log(grid);

  return (
    <div className="h-screen flex justify-center items-center border-2 w-full">
      <div className="text-white transform-gpu rotate-[30deg] -skew-x-[30deg]">
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
