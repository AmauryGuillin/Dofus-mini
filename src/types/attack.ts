import { Player } from "./player";

// export interface BouftouBite {
//   target?: Player;
//   attackName?: "Morsure du Bouftou";
//   dammage: number;
//   range: 1;
//   cost: 4;
//   canAutoTarget: false;
// }

// export interface Pression {
//   target?: Player;
//   attackName: "Pression";
//   dammage: number;
//   range: 2;
//   cost: 3;
//   canAutoTarget: false;
// }

// export interface Compulsion {
//   target?: Player;
//   attackName: "Compulsion";
//   boost: number;
//   range: 0;
//   cost: 3;
//   canAutoTarget: true;
// }

export interface Spell {
  target?: Player;
  attackName: "Morsure du Bouftou" | "Pression" | "Compulsion";
  damage?: number;
  boost?: number;
  range: number;
  cost: number;
  canAutoTarget: boolean;
}
