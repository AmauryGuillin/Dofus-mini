import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { playErrorSound } from "@/utils/music/handleAudio";
import { useStore } from "./store";

export function useEntityActionsUtils(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
) {
  const board = useStore((state) => state.board);
  const setCanMove = useStore((state) => state.setCanMove);
  const setPMRangeDisplay = useStore((state) => state.setPMRangeDisplay);

  function calculateEnemyPositionComparedToPlayer(
    enemyCell: string,
    playerCell: string
  ): string | undefined {
    let position: "left" | "right" | "up" | "down" | undefined;

    const [enemyRow, enemyCol] = enemyCell.split("-").map(Number);
    const [playerRow, playerCol] = playerCell.split("-").map(Number);

    if (enemyRow === playerRow && enemyCol < playerCol) position = "left";
    if (enemyRow > playerRow && enemyCol < playerCol) position = "down";
    if (enemyRow > playerRow && enemyCol === playerCol) position = "down";
    if (enemyRow > playerRow && enemyCol > playerCol) position = "down";
    if (enemyRow === playerRow && enemyCol > playerCol) position = "right";
    if (enemyRow < playerRow && enemyCol > playerCol) position = "right";
    if (enemyRow < playerRow && enemyCol === playerCol) position = "up";
    if (enemyRow < playerRow && enemyCol < playerCol) position = "up";

    return position;
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

  function handlePlayerMovementDirection(
    playerCell: string,
    targetCell: string
  ): string | undefined {
    let position: "left" | "right" | "up" | "down" | undefined;
    const [playerRow, playerCol] = playerCell.split("-").map(Number);
    const [targetCellRow, targetCellCol] = targetCell.split("-").map(Number);

    if (targetCellRow === playerRow && targetCellCol < playerCol)
      position = "left";
    if (targetCellRow > playerRow && targetCellCol < playerCol)
      position = "down";
    if (targetCellRow > playerRow && targetCellCol === playerCol)
      position = "down";
    if (targetCellRow > playerRow && targetCellCol > playerCol)
      position = "down";
    if (targetCellRow === playerRow && targetCellCol > playerCol)
      position = "right";
    if (targetCellRow < playerRow && targetCellCol > playerCol)
      position = "right";
    if (targetCellRow < playerRow && targetCellCol === playerCol)
      position = "up";
    if (targetCellRow < playerRow && targetCellCol < playerCol) position = "up";

    return position;
  }

  function calculPMRangeDisplay(
    entity: Player | Enemy,
    boardWidth: number,
    boardLength: number
  ) {
    const [playerRow, playerCol] = entity.position.split("-").map(Number);
    const pmRangeCells = [];

    for (let rowOffset = -entity.pm; rowOffset <= entity.pm; rowOffset++) {
      for (let colOffset = -entity.pm; colOffset <= entity.pm; colOffset++) {
        const newRow = playerRow + rowOffset;
        const newCol = playerCol + colOffset;

        // Calculate the Manhattan distance
        const manhattanDistance = Math.abs(rowOffset) + Math.abs(colOffset);

        // Check if the new position is within the bounds of the board and within the attack range
        if (
          newRow >= 0 &&
          newRow < boardLength &&
          newCol >= 0 &&
          newCol < boardWidth &&
          manhattanDistance <= entity.pm
        ) {
          pmRangeCells.push(`${newRow}-${newCol}`);
        }
      }
    }

    const RangewithoutPlayerCell = pmRangeCells.filter(
      (e) => e != `${playerRow}-${playerCol}`
    );
    setPMRangeDisplay(RangewithoutPlayerCell);
  }

  return {
    calculateEnemyPositionComparedToPlayer,
    calculatePath,
    calculateDistance,
    addErrorMessage,
    addInfoMessage,
    handlePlayerMovementDirection,
    calculPMRangeDisplay,
  };
}
