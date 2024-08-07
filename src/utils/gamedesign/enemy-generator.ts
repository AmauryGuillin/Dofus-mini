import { Enemy } from "@/types/enemy";

export function generateEnemy(): Enemy {
  return {
    name: "Bouftou",
    illustration: "./images/bouftou.png",
    position: "1-6",
    orientation: "right",
    pv: 300,
    pm: 3,
    pa: 6,
    isTurnToPlay: false,
    damageTaken: null,
    isIllustrationReverted: false,
  };
}
