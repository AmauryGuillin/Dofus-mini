import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generateBouftouBite(): Spell {
  return {
    attackName: "Morsure du Bouftou",
    damage: getRandomIntMinMax(999, 999),
    range: 1,
    cost: 4,
    canAutoTarget: false,
  };
}
