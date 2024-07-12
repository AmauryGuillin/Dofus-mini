import { Spell } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generateCompulsion(): Spell {
  return {
    attackName: "Compulsion",
    boost: getRandomIntMinMax(6, 11),
    range: 0,
    cost: 3,
    canAutoTarget: true,
  };
}
