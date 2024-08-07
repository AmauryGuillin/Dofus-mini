export interface Player {
  name: "Iopette";
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
  isCompulsionAnimated: boolean;
  isPressionAnimated: boolean;
}
