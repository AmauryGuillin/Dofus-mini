import { Player } from "./player";

export interface BouftouBite {
  target?: Player;
  attackName?: "Morsure du Bouftou";
  dammage: number;
  range: 1;
  cost: 4;
}

export interface Pression {
  target?: Player;
  attackName: "Pression";
  dammage: number;
  range: 2;
  cost: 3;
}
