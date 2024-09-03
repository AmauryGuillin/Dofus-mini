import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    type: "Player",
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    position: "6-1",
    orientation: "right",
    pvMax: 125,
    pv: 125,
    pmMax: 3,
    pm: 3,
    paMax: 6,
    pa: 6,
    isTurnToPlay: true,
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
