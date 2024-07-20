import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generatePression(): Spell {
  return {
    attackName: "Pression",
    damage: getRandomIntMinMax(50, 50),
    range: 2,
    cost: 3,
    canAutoTarget: false,
  };
}
