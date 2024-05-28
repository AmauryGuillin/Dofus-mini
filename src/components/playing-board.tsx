import { useEffect, useState } from "react";
import { Board } from "../types/board";

export default function PlayingBoard() {
  const [targetedCell, setTargetedCell] = useState<string>();
  const [path, setPath] = useState<string[]>([]);
  const board: Board = {
    name: "main",
    width: 4,
    length: 4,
  };

  useEffect(() => {
    setTargetedCell("3-0");
  }, []);

  function calculatePath(start: string, end: string): string[] {
    //transforme la position de départ en deux nombres distincs "startRow" et "startCol" rangé dans un tableau
    const [startRow, startCol] = start.split("-").map(Number);

    //transforme la position d'arrivée en deux nombres distincs "endRow" et "endCol" rangé dans un tableau
    const [endRow, endCol] = end.split("-").map(Number);

    const queue = [[startRow, startCol]];

    //chaque élément d'un "Set" doit être unique
    const visited = new Set();

    //collection sous forme de clé-valeur
    const cameFrom = new Map();

    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    //on ajoute une nouvelle valeur de position à visited -> la valeur de départ
    visited.add(`${startRow}-${startCol}`);

    //tant que queue contient une valeur
    while (queue.length > 0) {
      //on indique dans row et col, les prochaines valeurs de la queue
      const [row, col] = queue.shift()!;

      //si les valeurs de row et col actuelles sont égales aux valeur finales (voulues par l'utilisateur)
      if (row === endRow && col === endCol) {
        //on set le path à "vide"
        const path = [];

        //on dit dur current = les valeurs finales
        let current = `${endRow}-${endCol}`;

        //tant que la valeur de current est différente de celle de départ
        while (current !== start) {
          //on ajoute au path les valeurs finales
          path.push(current);

          //met à jour l'historique du chemin pour reconstruire le chemin final
          current = cameFrom.get(current);
        }
        path.push(start);
        return path.reverse();
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

  function selectCell(key: string) {
    setTargetedCell(key);
    setPath([]);
  }

  function enter(key: string) {
    const newPath = calculatePath(targetedCell!, key);
    setPath(newPath);
  }

  function leave() {
    setPath([]);
  }

  const grid = Array.from({ length: board.length }, (_, rowIndex) =>
    Array.from({ length: board.width }, (_, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      return (
        <div
          key={key}
          className={`w-24 h-24 border-2 border-gray-500 hover:bg-green-500 ${
            key === targetedCell
              ? "bg-red-500"
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
