import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    position: "3-4",
    orientation: "right",
    pv: 999,
    pm: 3,
    pa: 6,
    isTurnToPlay: false,
    damageTaken: null,
    isIllustrationReverted: false,
    isIllustrationPositionCorrectedDown: false,
    isIllustrationPositionCorrectedUp: false,
    isIllustrationPositionCorrectedLeft: false,
    isCompulsionAnimated: false,
    isPressionAnimated: false,
    isMoving: false,
    isAttacked: false,
    isDead: false,
  };
}
