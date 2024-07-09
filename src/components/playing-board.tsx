import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { Board } from "../types/board";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import EnemyInfo from "./enemy-info";
import PlayerInfo from "./player-info";
import PlayerTurnImage from "./player-turn-image";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
  setTurnCount: React.Dispatch<React.SetStateAction<number>>;
  turnCount: number;
  setBoostDuration: React.Dispatch<React.SetStateAction<number | undefined>>;
  boostDuration: number | undefined;
};

const player: Player = {
  name: "Iopette",
  pv: 100,
  pm: 3,
  pa: 6,
};

const enemy: Player = {
  name: "Bouftou",
  pv: 100,
  pm: 3,
  pa: 6,
};

const board: Board = {
  name: "main",
  width: 8,
  length: 8,
};

export default function PlayingBoard({
  setMessages,
  setTurnCount,
  turnCount,
  setBoostDuration,
  boostDuration,
}: Props) {
  const [
    isUserImageDisplayed,
    passTurn,
    grid,
    turn,
    //canPlayerPassTurn, //A implémenter quand IA sera OK
  ] = usePlayingBoard(
    player,
    enemy,
    board,
    setMessages,
    setTurnCount,
    turnCount,
    setBoostDuration,
    boostDuration
  );

  return (
    <div className="h-screen flex justify-center items-center w-full text-white relative">
      {isUserImageDisplayed && <PlayerTurnImage player={turn} />}
      <EnemyInfo enemy={enemy} />
      <PlayerInfo player={player} />
      <div className="transform-gpu rotate-[30deg] -skew-x-[30deg]">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row}
            </div>
          );
        })}
        <div>
          <button
            type="button"
            className="border-2 w-36 h-12 hover:scale-110 transition-all delay-[10ms] hover:bg-gray-800"
            // onClick={() => {
            //   if (canPlayerPassTurn) passTurn(turn.name);
            // }}
            onClick={() => passTurn(turn.name)}
          >
            Passer le tour
          </button>
        </div>
      </div>
    </div>
  );
}
