export interface Enemy {
  type: "Enemy";
  name: "Bouftou";
  illustration: string;
  position: string;
  orientation: string;
  pv: number;
  pm: number;
  pa: number;
  isTurnToPlay: boolean;
  damageTaken: number | null;
  isIllustrationReverted: boolean;
  isIllustrationPositionCorrectedDown: boolean;
  isIllustrationPositionCorrectedUp: boolean;
  isIllustrationPositionCorrectedLeft: boolean;
  isMoving: boolean;
}
