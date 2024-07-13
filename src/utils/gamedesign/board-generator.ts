import { Board } from "@/types/board";

export function generateBoard(): Board {
  return {
    name: "main",
    width: 8,
    length: 8,
  };
}
