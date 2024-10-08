import { Enemy } from "@/types/enemy";
import { generateRandomPosition } from "../tools/randomGenerators";

export function generateEnemy(): Enemy {
  return {
    type: "Enemy",
    name: "Bouftou",
    illustration: "./enemy-static/bouftou.png",
    staticIllustrationTmp: "./enemy-static/bouftou.png",
    portraitIllustration: "./enemy-static/bouftou.png",
    position: generateRandomPosition(),
    orientation: "down",
    pvMax: 250,
    pv: 250,
    pmMax: 3,
    pm: 3,
    paMax: 6,
    pa: 6,
    isTurnToPlay: false,
    damageTaken: null,
    isIllustrationReverted: true,
    isIllustrationPositionCorrectedDown: false,
    isIllustrationPositionCorrectedUp: false,
    isIllustrationPositionCorrectedLeft: false,
    isAttackAnimated: false,
    isAttacked: false,
    isMoving: false,
    isDead: false,
    showInfo: false,
    showPM: false,
  };
}
