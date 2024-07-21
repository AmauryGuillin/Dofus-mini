import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    //illustration: "./player-animations/attack-close-animation-1.gif",
    pv: 100,
    pm: 999,
    pa: 999,
    isTurnToPlay: true,
    damageTaken: null,
    isCompulsionAnimated: false,
    isPressionAnimated: false,
  };
}
