import { useStore } from "../hooks/store";
import { Spell } from "../types/attack";
import { generatePression } from "../utils/gamedesign/player-attack-generator";
import { generateCompulsion } from "../utils/gamedesign/player-boost-generator";
import { playClickSounds } from "../utils/music/handleAudio";

export default function SpellBar() {
  const playerCell = useStore((state) => state.playerCell);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );
  const boostDuration = useStore((state) => state.boostDuration);
  const setPlayerOnAttackMode = useStore(
    (state) => state.setPlayerOnAttackMode
  );

  type SpellSource = {
    id: string;
    image: string;
    spell: Spell;
  };

  const spellsSources: SpellSource[] = [
    {
      id: crypto.randomUUID(),
      image: "./images/player-spells/141.svg",
      spell: generatePression(),
    },
    {
      id: crypto.randomUUID(),
      image: "./images/player-spells/144.svg",
      spell: generateCompulsion(),
    },
  ];

  function selectSpell(spell: Spell) {
    playClickSounds(0.3);
    setSelectedSpell(spell);
    calculAttackRangeDisplay(playerCell, spell, 8, 8);
    setPlayerOnAttackMode(true);
  }

  function calculAttackRangeDisplay(
    playerPosition: string,
    spell: Spell,
    boardWidth: number,
    boardHeight: number
  ) {
    const [playerRow, playerCol] = playerPosition.split("-").map(Number);
    const attackRangeCells = [];

    for (let rowOffset = -spell.range; rowOffset <= spell.range; rowOffset++) {
      for (
        let colOffset = -spell.range;
        colOffset <= spell.range;
        colOffset++
      ) {
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
          manhattanDistance <= spell.range
        ) {
          attackRangeCells.push(`${newRow}-${newCol}`);
        }
      }
    }

    if (spell.canAutoTarget) {
      const RangeWithPlayerCell = attackRangeCells;
      setAttackRangeDisplay(RangeWithPlayerCell);
    } else {
      const RangewithoutPlayerCell = attackRangeCells.filter(
        (e) => e != `${playerRow}-${playerCol}`
      );
      setAttackRangeDisplay(RangewithoutPlayerCell);
    }
  }

  return (
    <>
      <div className="text-white h-full w-full flex items-start pt-2 pl-2 gap-1 bg-slate-950">
        {spellsSources.map((spell) => (
          <div
            key={spell.id}
            className={`w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105 relative ${
              spell.spell.attackName === "Compulsion" &&
              boostDuration !== undefined
                ? "grayscale contrast-75"
                : ""
            }`}
            onClick={() => selectSpell(spell.spell)}
          >
            <img src={spell.image} className="w-80" />
            {boostDuration !== undefined &&
              spell.spell.attackName === "Compulsion" && (
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
