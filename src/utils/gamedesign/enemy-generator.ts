import { Enemy } from "@/types/enemy";

export function generateEnemy(): Enemy {
  return {
    name: "Bouftou",
    pv: 10000,
    pm: 3,
    pa: 6,
    isTurnToPlay: false,
    damageTaken: null,
  };
}
