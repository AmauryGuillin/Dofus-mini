import { Player } from "@/types/player";

export function generateEnemy(): Player {
  return {
    name: "Bouftou",
    pv: 100,
    pm: 3,
    pa: 6,
  };
}
