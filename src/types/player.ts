export interface Player {
  type: "Player";
  name: "Iopette";
  illustration: string;
  position: string;
  orientation: "up" | "down" | "right" | "left";
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
  isCompulsionAnimated: boolean;
  isPressionAnimated: boolean;
  isMoving: boolean;
  isAttacked: boolean;
  isDead: boolean;
}
