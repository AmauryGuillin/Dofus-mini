import { Player } from "./player";

export interface Spell {
  target?: Player;
  attackName: "Morsure du Bouftou" | "Pression" | "Compulsion" | "Bond";
  damage?: number;
  boost?: number;
  range: number;
  cost: number;
  canAutoTarget: boolean;
}
