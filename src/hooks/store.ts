import { Board } from "@/types/board";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { generateBoard } from "@/utils/gamedesign/board-generator";
import { generateEnemy } from "@/utils/gamedesign/enemy-generator";
import { generatePlayer } from "@/utils/gamedesign/player-generator";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Spell } from "../types/attack";

type InitialState = {
  gameStarted: boolean;
  board: Board;
  player: Player;
  enemy: Enemy;
  selectedSpell: Spell | null;
  attackRangeDisplay: string[];
  pmRangeDisplay: string[];
  isGameOver: boolean;
  isGameWin: boolean;
  turnCount: number;
  boostDuration: number | undefined;
  playerOnAttackMode: boolean;
  canMove: boolean;
  path: string[];
  gameTimeSeconds: number;
  gameTimeMinutes: number;
  gameTimeHours: number;
};

type Actions = {
  setGameStarted: (value: boolean) => void;
  setBoard: (board: Board) => void;
  setPlayer: (player: Player) => void;
  setPlayerInfo: (
    info: keyof Player,
    value: number | string | boolean | null
  ) => void;
  setPlayerPM: (pm: number) => void; //deprecated
  setEnemy: (enemy: Enemy) => void;
  setEnemyInfo: (
    info: keyof Enemy,
    value: number | string | boolean | null
  ) => void;
  setSelectedSpell: (spell: Spell | null) => void;
  setAttackRangeDisplay: (range: string[]) => void;
  setPMRangeDisplay: (range: string[]) => void;
  setIsGameOver: (value: boolean) => void;
  setIsGameWin: (value: boolean) => void;
  setTurnCount: (value: number) => void;
  setBoostDuration: (value: number | undefined) => void;
  setPlayerOnAttackMode: (value: boolean) => void;
  setCanMove: (value: boolean) => void;
  setPath: (value: string[]) => void;
  setGameTimeSeconds: (value: number) => void;
  setGameTimeMinutes: (value: number) => void;
  setGameTimeHours: (value: number) => void;
};

type Store = InitialState & Actions;

const initialState: InitialState = {
  gameStarted: false,
  board: generateBoard(),
  player: generatePlayer(),
  enemy: generateEnemy(),
  selectedSpell: null,
  attackRangeDisplay: [],
  pmRangeDisplay: [],
  isGameOver: false,
  isGameWin: false,
  turnCount: 1,
  boostDuration: undefined,
  playerOnAttackMode: false,
  canMove: false,
  path: [],
  gameTimeSeconds: 0,
  gameTimeMinutes: 0,
  gameTimeHours: 0,
};

export const useStore = create<Store>()(
  devtools((set) => ({
    ...initialState,
    setGameStarted: (value) => set(() => ({ gameStarted: value })),
    setBoard: (board) => set(() => ({ board: board })),
    setPlayer: (player) => set(() => ({ player: player })),
    setPlayerInfo: (info, value) =>
      set(
        (state) => ({ player: { ...state.player, [info]: value } }),
        false,
        "playerInfo"
      ),
    setPlayerPM: (pm) => set((state) => ({ player: { ...state.player, pm } })), //deprecated
    setEnemy: (enemy) => set(() => ({ enemy: enemy })),
    setEnemyInfo: (info, value) =>
      set((state) => ({ enemy: { ...state.enemy, [info]: value } })),
    setSelectedSpell: (spell) => set(() => ({ selectedSpell: spell })),
    setAttackRangeDisplay: (range) =>
      set(() => ({ attackRangeDisplay: range })),
    setPMRangeDisplay: (range) => set(() => ({ pmRangeDisplay: range })),
    setIsGameOver: (value) => set(() => ({ isGameOver: value })),
    setIsGameWin: (value) => set(() => ({ isGameWin: value })),
    setTurnCount: (value) => set(() => ({ turnCount: value })),
    setBoostDuration: (value) => set(() => ({ boostDuration: value })),
    setPlayerOnAttackMode: (value) =>
      set(
        () => ({ playerOnAttackMode: value }),
        false,
        "setPlayerOnAttackMode"
      ),
    setCanMove: (value) => set(() => ({ canMove: value }), false, "setCanMove"),
    setPath: (value) => set(() => ({ path: value })),
    setGameTimeSeconds: (value) => set(() => ({ gameTimeSeconds: value })),
    setGameTimeMinutes: (value) => set(() => ({ gameTimeMinutes: value })),
    setGameTimeHours: (value) => set(() => ({ gameTimeHours: value })),
  }))
);

if (
  useStore.getState().player.position === useStore.getState().enemy.position
) {
  let [row, col] = useStore.getState().enemy.position.split("-").map(Number);
  row++;
  col++;
  const concat = `${row}-${col}`;
  useStore.getState().setEnemyInfo("position", concat);
}
