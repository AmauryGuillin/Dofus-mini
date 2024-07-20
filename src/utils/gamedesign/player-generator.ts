import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    //illustration: "./player-animations/attack-close-animation-1.gif",
    pv: 100,
    pm: 3,
    pa: 6,
    isTurnToPlay: true,
    damageTaken: null,
    isBoostAnimated: false,
    isAttackAnimated: false,
  };
}
