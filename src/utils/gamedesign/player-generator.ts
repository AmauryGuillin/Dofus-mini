import { Player } from "@/types/player";
import { generateRandomPosition } from "../tools/randomGenerators";

export function generatePlayer(): Player {
  return {
    type: "Player",
    name: "Iopette",
    illustration: "./player-static/player-static-front-right.png",
    portraitIllustration: "./player-static/player-static-front-right.png",
    position: generateRandomPosition(),
    orientation: "right",
    pvMax: 100,
    pv: 100,
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
    showInfo: false,
    showPM: false,
  };
}
