import { useCallback, useEffect, useState } from "react";
import { playClickSounds } from "../utils/music/handleAudio";

type Props = {
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function SpellBar({ setSelectedSpell }: Props) {
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
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (draggingSpell !== null) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    }

    function handleMouseUp() {
      setDraggingSpell(null);
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
      setDraggingSpell(null); // Cancel drag if clicked again
    } else {
      setDraggingSpell(index);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "&" || event.key === "1") {
      selectSpell(0);
      handleMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>, 0);
    }
    if (event.key === "é" || event.key === "2") {
      selectSpell(1);
      handleMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>, 1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <div className="text-white h-full w-full flex items-start pt-2 pl-2 gap-1 bg-slate-950">
        {spellsSources.map((spell, index) => (
          <div
            key={index}
            className="w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105"
            onClick={(event) => handleMouseDown(event, index)}
            onMouseDownCapture={() => selectSpell(index)}
            onKeyDown={() => handleKeyPress}
          >
            <img src={spell} className="w-80" />
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
