import { useState } from "react";
import { Board } from "../types/board";

export default function PlayingBoard() {
  const [targetedCell, setTargetedCell] = useState<number>();
  const board: Board = {
    name: "main",
    width: 4,
    length: 4,
  };

  function selectCell(cell: number) {
    setTargetedCell(cell);
    console.log(targetedCell);
  }

  const grid = [board.width, board.length];

  return (
    <>
      <div className="w-full h-screen border-2">
        <div className="text-white transform-gpu rotate-[30deg] -skew-x-[30deg]"></div>
      </div>
    </>
  );

  //   const grid = Array.from({ length: board.length }, (_, rowIndex) =>
  //     Array.from({ length: board.width }, (_, colIndex) => (
  //       <div
  //         key={`${rowIndex}-${colIndex}`}
  //         className="w-24 h-24 border-2 border-gray-500 hover:bg-gray-400"
  //       />
  //     ))
  //   );

  //   return (
  //     <div className="text-white transform-gpu rotate-[30deg] -skew-x-[30deg]">
  //       {grid.map((row, rowIndex) =>
  //         rowIndex === targetedCell ? (
  //           <div
  //             key={rowIndex}
  //             className="flex bg-red-500"
  //             onClick={() => selectCell(rowIndex)}
  //           >
  //             {row}
  //           </div>
  //         ) : (
  //           <div
  //             key={rowIndex}
  //             className="flex"
  //             onClick={() => selectCell(rowIndex)}
  //           >
  //             {row}
  //           </div>
  //         )
  //       )}
  //     </div>
  //   );
}
