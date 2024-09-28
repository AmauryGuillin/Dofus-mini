import { useEffect } from "react";
import { useStore } from "../hooks/store";
import { Spell } from "../types/attack";
import {
  generateBond,
  generatePression,
} from "../utils/gamedesign/player-attack-generator";
import { generateCompulsion } from "../utils/gamedesign/player-boost-generator";
import { playClickSounds } from "../utils/music/handleAudio";
import { Card, CardContent } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function SpellBar() {
  const player = useStore((state) => state.player);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );
  const boostDuration = useStore((state) => state.boostDuration);
  const setPlayerOnAttackMode = useStore(
    (state) => state.setPlayerOnAttackMode
  );
  const board = useStore((state) => state.board);

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
    {
      id: crypto.randomUUID(),
      image: "./images/player-spells/142.svg",
      spell: generateBond(),
    },
  ];

  function selectSpell(spell: Spell) {
    if (!player.isTurnToPlay) return;
    if (player.isMoving) return;
    if (spell.cost > player.pa) return;
    if (spell.attackName === "Bond" && player.bondCooldown != null) return;
    if (spell.attackName === "Compulsion" && boostDuration != null) return;
    playClickSounds(0.3);
    setSelectedSpell(spell);
    calculAttackRangeDisplay(player.position, spell, board.width, board.length);
    setPlayerOnAttackMode(true);
  }

  function calculAttackRangeDisplay(
    playerPosition: string,
    spell: Spell,
    boardWidth: number,
    boardLength: number
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
          newRow < boardLength &&
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "&" && player.pa >= spellsSources[0].spell.cost) {
        selectSpell(spellsSources[0].spell);
      } else if (
        event.key === "é" &&
        player.pa >= spellsSources[1].spell.cost
      ) {
        selectSpell(spellsSources[1].spell);
      } else if (
        event.key === '"' &&
        player.pa >= spellsSources[2].spell.cost
      ) {
        selectSpell(spellsSources[2].spell);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [spellsSources]);

  return (
    <Card className="h-full bg-transparent">
      <CardContent className="flex gap-2 overflow-auto p-2">
        {spellsSources.map((spell) => (
          <TooltipProvider key={spell.id}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105 relative ${
                    (spell.spell.attackName === "Compulsion" &&
                      boostDuration !== undefined) ||
                    (spell.spell.attackName === "Bond" &&
                      player.bondCooldown !== null) ||
                    player.pa < spell.spell.cost
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
                  {player.bondCooldown !== null &&
                    spell.spell.attackName === "Bond" && (
                      <div className="absolute top-2 left-4 text-black font-extrabold text-2xl">
                        {player.bondCooldown}
                      </div>
                    )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {spell.spell.attackName === "Pression" ? (
                  <>
                    <p className="font-bold text-red-500">Pression</p>
                    <p>Inflige 15 à 25 points de dommages</p>
                  </>
                ) : spell.spell.attackName === "Compulsion" ? (
                  <>
                    <p className="font-bold text-red-500">Compulsion</p>
                    <p>
                      Augmente de 6 à 11 points les dommages infligés par
                      Pression
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-red-500">Bond</p>
                    <p>Déplace le joueur jusqu'à 2 cases autour de lui</p>
                  </>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </CardContent>
    </Card>
  );
}
