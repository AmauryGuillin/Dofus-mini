import { Enemy } from "@/types/enemy";

export function generateEnemy(): Enemy {
  return {
    type: "Enemy",
    name: "Bouftou",
    illustration: "./enemy-static/bouftou.png",
    //illustration: "./enemy-animations/bouftou-death-left.gif",
    position: "3-3",
    orientation: "down",
    pv: 300,
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
  };
}
