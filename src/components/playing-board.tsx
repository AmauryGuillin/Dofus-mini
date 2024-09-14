import { useStore } from "@/hooks/store";
import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { ChatInfoMessage } from "../types/chat-info-message";
import PlayerTurnImage from "./player-turn-image";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
};

export default function PlayingBoard({ setMessages }: Props) {
  const player = useStore((state) => state.player);

  const [isUserImageDisplayed, passTurn, grid] = usePlayingBoard(setMessages);

  return (
    <>
      {isUserImageDisplayed && <PlayerTurnImage />}
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
            onClick={() => {
              if (player.isTurnToPlay) passTurn(player.name);
            }}
          >
            Passer le tour
          </button>
        </div>
      </div>
    </>
  );
}
