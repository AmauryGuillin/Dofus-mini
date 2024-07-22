import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    //illustration: "./player-animations/attack-close-animation-left.gif",
    position: "6-1",
    orientation: "right",
    pv: 100,
    pm: 999,
    pa: 999,
    isTurnToPlay: true,
    damageTaken: null,
    isIllustrationReverted: false,
    isIllustrationPositionCorrectedDown: false,
    isIllustrationPositionCorrectedUp: false,
    isIllustrationPositionCorrectedLeft: false,
    isCompulsionAnimated: false,
    isPressionAnimated: false,
  };
}
