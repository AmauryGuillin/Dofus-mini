import { BouftouBite } from "../../types/attack";
import { getRandomIntMinMax } from "../tools/getRandomNumber";

export function generateBouftouBite(): BouftouBite {
  return {
    attackName: "Morsure du Bouftou",
    dammage: getRandomIntMinMax(5, 25),
    range: 1,
    cost: 4,
  };
}
