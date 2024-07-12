import { Pression } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generatePression(): Pression {
  return {
    attackName: "Pression",
    dammage: getRandomIntMinMax(7, 25),
    range: 2,
    cost: 3,
    canAutoTarget: false,
  };
}
