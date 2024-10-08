export interface Player {
  type: "Player";
  name: "Iopette";
  illustration: string;
  portraitIllustration: string;
  position: string;
  orientation: "up" | "down" | "right" | "left";
  pvMax: number;
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
  showInfo: boolean;
  showPM: boolean;
  bondCooldown: number | null;
}
