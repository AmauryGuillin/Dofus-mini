import { Player } from "@/types/player";

export function generatePlayer(): Player {
  return {
    name: "Iopette",
    pv: 100,
    pm: 3,
    pa: 6,
    isTurnToPlay: true,
    damageTaken: null,
  };
}
