import { useCallback, useEffect, useState } from "react";
import { playClickSounds } from "../utils/music/handleAudio";

type Props = {
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>;
  boostDuration: number | undefined;
  setAttackRangeDisplay: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function SpellBar({
  setSelectedSpell,
  boostDuration,
  setAttackRangeDisplay,
}: Props) {
  const spellsSources = [
    "./images/player-spells/141.svg",
    "./images/player-spells/144.svg",
  ];

  const [draggingSpell, setDraggingSpell] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  function selectSpell(spell: number) {
    playClickSounds(0.3);
    setSelectedSpell(spell);
    calculAttackRangeDisplay("3-3", 2, 8, 8); //TODO : A modifier avec le refonte des useStates pour intégrer la position du joueur en temps réel.
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (draggingSpell !== null) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    }

    function handleMouseUp() {
      setDraggingSpell(null);
      setAttackRangeDisplay([]);
      //setSelectedSpell(undefined);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingSpell]);

  function handleMouseDown(
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) {
    if (draggingSpell === index) {
      setDraggingSpell(null);
      setSelectedSpell(undefined);
      setAttackRangeDisplay([]);
    } else {
      setDraggingSpell(index);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "&" || event.key === "1") {
      selectSpell(0);
      setSelectedSpell(0);
      handleMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>, 0);
    }
    if (event.key === "é" || event.key === "2") {
      selectSpell(1);
      setSelectedSpell(1);
      handleMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>, 1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  function calculAttackRangeDisplay(
    playerPosition: string,
    range: number,
    boardWidth: number,
    boardHeight: number
  ) {
    const [playerRow, playerCol] = playerPosition.split("-").map(Number);
    const attackRangeCells = [];

    for (let rowOffset = -range; rowOffset <= range; rowOffset++) {
      for (let colOffset = -range; colOffset <= range; colOffset++) {
        const newRow = playerRow + rowOffset;
        const newCol = playerCol + colOffset;

        // Calculate the Manhattan distance
        const manhattanDistance = Math.abs(rowOffset) + Math.abs(colOffset);

        // Check if the new position is within the bounds of the board and within the attack range
        if (
          newRow >= 0 &&
          newRow < boardHeight &&
          newCol >= 0 &&
          newCol < boardWidth &&
          manhattanDistance <= range
        ) {
          attackRangeCells.push(`${newRow}-${newCol}`);
        }
      }
    }

    setAttackRangeDisplay(attackRangeCells);
  }

  return (
    <>
      <div className="text-white h-full w-full flex items-start pt-2 pl-2 gap-1 bg-slate-950">
        {spellsSources.map((spell, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105 relative ${
              index === 1 && boostDuration !== undefined
                ? "grayscale contrast-75"
                : ""
            }`}
            onClick={(event) => handleMouseDown(event, index)}
            onMouseDownCapture={() => selectSpell(index)}
            onKeyDown={() => handleKeyPress}
          >
            <img src={spell} className="w-80" />
            {boostDuration !== undefined && index === 1 && (
              <div className="absolute top-2 left-4 text-black font-extrabold text-2xl">
                {boostDuration}
              </div>
            )}
          </div>
        ))}
      </div>
      {draggingSpell !== null && (
        <img
          src={spellsSources[draggingSpell]}
          className="w-10 fixed pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
}
