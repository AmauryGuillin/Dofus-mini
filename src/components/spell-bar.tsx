import { useStore } from "../hooks/store";
import { playClickSounds } from "../utils/music/handleAudio";

export default function SpellBar() {
  const playerCell = useStore((state) => state.playerCell);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );
  const boostDuration = useStore((state) => state.boostDuration);

  const spellsSources = [
    "./images/player-spells/141.svg",
    "./images/player-spells/144.svg",
  ];

  function selectSpell(spell: number) {
    playClickSounds(0.3);
    setSelectedSpell(spell);
    calculAttackRangeDisplay(playerCell, 2, 8, 8);
  }

  function calculAttackRangeDisplay(
    playerPosition: string,
    range: number,
    boardWidth: number,
    boardHeight: number
  ) {
    const [playerRow, playerCol] = playerPosition.split("-").map(Number);
    const attackRangeCells = [];
    console.log(playerPosition);

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
            onClick={() => selectSpell(index)}
            onMouseDownCapture={() => selectSpell(index)}
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
    </>
  );
}
