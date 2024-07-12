import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generatePression(): Spell {
  return {
    attackName: "Pression",
    damage: getRandomIntMinMax(7, 25),
    range: 2,
    cost: 3,
    canAutoTarget: false,
  };
}
