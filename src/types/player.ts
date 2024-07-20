export interface Player {
  name: "Iopette";
  illustration: string;
  pv: number;
  pm: number;
  pa: number;
  isTurnToPlay: boolean;
  damageTaken: number | null;
  isBoostAnimated: boolean;
  isAttackAnimated: boolean;
}
