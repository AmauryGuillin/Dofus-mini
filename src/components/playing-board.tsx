import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { ChatInfoMessage } from "../types/chat-info-message";
import EnemyInfo from "./enemy-info";
import PlayerTurnImage from "./player-turn-image";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
};

export default function PlayingBoard({ setMessages }: Props) {
  const [
    isUserImageDisplayed,
    passTurn,
    grid,
    turn,
    //canPlayerPassTurn, //A implémenter quand IA sera OK
  ] = usePlayingBoard(setMessages);

  return (
    <div className="h-screen flex justify-center items-center w-full text-white relative">
      {isUserImageDisplayed && <PlayerTurnImage player={turn} />}
      <EnemyInfo />
      <div className="transform-gpu rotate-[30deg] -skew-x-[38deg]">
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
