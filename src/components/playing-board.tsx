import { useStore } from "@/hooks/store";
import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { ChatInfoMessage } from "../types/chat-info-message";
import PlayerTurnImage from "./player-turn-image";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
};

export default function PlayingBoard({ setMessages }: Props) {
  const player = useStore((state) => state.player);
  const enemy = useStore((state) => state.enemy);

  const [
    isUserImageDisplayed,
    passTurn,
    grid,
    //canPlayerPassTurn, //A implémenter quand IA sera OK
  ] = usePlayingBoard(setMessages);

  return (
    <>
      {isUserImageDisplayed && <PlayerTurnImage />}
      {/* <EnemyInfo /> */}
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
            className="border-2 w-36 h-12 hover:scale-110 transition-all delay-[10ms] hover:bg-gray-800 text-white"
            // onClick={() => {
            //   if (canPlayerPassTurn) passTurn(turn.name);
            // }}
            //onClick={() => passTurn(turn.name)}
            onClick={() =>
              player.isTurnToPlay ? passTurn(player.name) : passTurn(enemy.name)
            }
          >
            Passer le tour
          </button>
        </div>
      </div>
    </>
  );
}
