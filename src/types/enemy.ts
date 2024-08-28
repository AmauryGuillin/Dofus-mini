export interface Enemy {
  type: "Enemy";
  name: "Bouftou";
  illustration: string;
  position: string;
  orientation: string;
  pv: number;
  pmMax: number;
  pm: number;
  paMax: number;
  pa: number;
  isTurnToPlay: boolean;
  damageTaken: number | null;
  isIllustrationReverted: boolean;
  isIllustrationPositionCorrectedDown: boolean;
  isIllustrationPositionCorrectedUp: boolean;
  isIllustrationPositionCorrectedLeft: boolean;
  isAttackAnimated: boolean;
  isAttacked: boolean;
  isMoving: boolean;
  isDead: boolean;
}
