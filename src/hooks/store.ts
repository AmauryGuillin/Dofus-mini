import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InitialState = {
  playerCell: string;
  selectedSpell: number | null;
  attackRangeDisplay: string[];
  isGameOver: boolean;
};

type Actions = {
  setPlayerCell: (position: string) => void;
  setSelectedSpell: (spell: number | null) => void;
  setAttackRangeDisplay: (range: string[]) => void;
  setIsGameOver: (value: boolean) => void;
};

type Store = InitialState & Actions;

const initialState: InitialState = {
  playerCell: "3-3",
  selectedSpell: null,
  attackRangeDisplay: [],
  isGameOver: false,
};

export const useStore = create<Store>()(
  devtools((set) => ({
    ...initialState,
    setPlayerCell: (position) => set(() => ({ playerCell: position })),
    setSelectedSpell: (spell) => set(() => ({ selectedSpell: spell })),
    setAttackRangeDisplay: (range) =>
      set(() => ({ attackRangeDisplay: range })),
    setIsGameOver: (value) => set(() => ({ isGameOver: value })),
  }))
);
