import { Player } from "./player";

export interface BouftouBite {
  target?: Player;
  attackName?: "Morsure du Bouftou";
  dammage: number;
}
