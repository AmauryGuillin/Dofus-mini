import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/randomGenerators";

export function generatePression(): Spell {
  return {
    attackName: "Pression",
    damage: getRandomIntMinMax(15, 25),
    range: 2,
    cost: 3,
    canAutoTarget: false,
  };
}

export function generateBond(): Spell {
  return {
    attackName: "Bond",
    range: 2,
    cost: 4,
    canAutoTarget: false,
  };
}
