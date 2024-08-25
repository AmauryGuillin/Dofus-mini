import { Enemy } from "@/types/enemy";

export function generateEnemy(): Enemy {
  return {
    name: "Bouftou",
    illustration: "./images/bouftou.png",
    position: "3-3",
    orientation: "right",
    pv: 300,
    pm: 3,
    pa: 999,
    isTurnToPlay: true,
    damageTaken: null,
    isIllustrationReverted: false,
  };
}
