import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/randomGenerators";

export function generateBouftouBite(): Spell {
  return {
    attackName: "Morsure du Bouftou",
    damage: getRandomIntMinMax(25, 35),
    range: 1,
    cost: 4,
    canAutoTarget: false,
  };
}
