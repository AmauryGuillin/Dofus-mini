import { Board } from "@/types/board";
import { Player } from "@/types/player";
import { generateBoard } from "@/utils/gamedesign/board-generator";
import { generateEnemy } from "@/utils/gamedesign/enemy-generator";
import { generatePlayer } from "@/utils/gamedesign/player-generator";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Spell } from "../types/attack";

type InitialState = {
  board: Board;
  player: Player;
  enemy: Player;
  playerCell: string;
  selectedSpell: Spell | null;
  attackRangeDisplay: string[];
  isGameOver: boolean;
  isGameWin: boolean;
  turnCount: number;
  boostDuration: number | undefined;
  playerOnAttackMode: boolean;
};

type Actions = {
  setBoard: (board: Board) => void;
  setPlayer: (player: Player) => void;
  setEnemy: (enemy: Player) => void;
  setPlayerCell: (position: string) => void;
  setSelectedSpell: (spell: Spell | null) => void;
  setAttackRangeDisplay: (range: string[]) => void;
  setIsGameOver: (value: boolean) => void;
  setIsGameWin: (value: boolean) => void;
  setTurnCount: (value: number) => void;
  setBoostDuration: (value: number | undefined) => void;
  setPlayerOnAttackMode: (value: boolean) => void;
};

type Store = InitialState & Actions;

const initialState: InitialState = {
  board: generateBoard(),
  player: generatePlayer(),
  enemy: generateEnemy(),
  playerCell: "3-3",
  selectedSpell: null,
  attackRangeDisplay: [],
  isGameOver: false,
  isGameWin: false,
  turnCount: 1,
  boostDuration: undefined,
  playerOnAttackMode: false,
};

export const useStore = create<Store>()(
  devtools((set) => ({
    ...initialState,
    setBoard: (board) => set(() => ({ board: board })),
    setPlayer: (player) => set(() => ({ player: player })),
    setEnemy: (enemy) => set(() => ({ enemy: enemy })),
    setPlayerCell: (position) => set(() => ({ playerCell: position })),
    setSelectedSpell: (spell) => set(() => ({ selectedSpell: spell })),
    setAttackRangeDisplay: (range) =>
      set(() => ({ attackRangeDisplay: range })),
    setIsGameOver: (value) => set(() => ({ isGameOver: value })),
    setIsGameWin: (value) => set(() => ({ isGameWin: value })),
    setTurnCount: (value) => set(() => ({ turnCount: value })),
    setBoostDuration: (value) => set(() => ({ boostDuration: value })),
    setPlayerOnAttackMode: (value) =>
      set(() => ({ playerOnAttackMode: value })),
  }))
);
