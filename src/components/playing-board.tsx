import { motion } from "framer-motion";
import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { Board } from "../types/board";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Player } from "../types/player";
import PlayerInfo from "./player-info";
import PlayerTurnImage from "./player-turn-image";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedSpell: number | undefined;
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
  setIsGameOver,
  setSelectedSpell,
  selectedSpell,
}: Props) {
  const [
    isUserImageDisplayed,
    playerPosition,
    enemyPosition,
    passTurn,
    grid,
    turn,
    selectCell,
    //canPlayerPassTurn, //A implémenter quand IA sera OK
  ] = usePlayingBoard(
    player,
    enemy,
    board,
    setMessages,
    setIsGameOver,
    setSelectedSpell,
    selectedSpell
  );

  return (
    <div className="h-screen flex justify-center items-center w-full text-white relative">
      {isUserImageDisplayed && <PlayerTurnImage player={turn} />}
      <PlayerInfo player={player} />
      <div className="transform-gpu rotate-[30deg] -skew-x-[30deg]">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row}
            </div>
          );
        })}
        <motion.div
          className="absolute"
          initial={false}
          animate={{
            top: playerPosition.x * 6 + "rem",
            left: playerPosition.y * 6 + "rem",
          }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-24 h-24 border-4 border-blue-400 rounded-full hover:cursor-pointer relative"
            onClick={() => {
              if (turn.name === player.name) {
                selectCell(`${enemyPosition.x}-${enemyPosition.y}`, player);
              } else {
                selectCell(`${playerPosition.x}-${playerPosition.y}`, enemy);
              }
            }}
          >
            <img
              src="./images/player-front-bottom-right.png"
              className="absolute top-[-138%] left-[-101%] h-[232%] max-w-[140%] transform rotate-[-30deg] skew-x-[20deg]"
            />
          </div>
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{
            top: enemyPosition.x * 6 + "rem",
            left: enemyPosition.y * 6 + "rem",
          }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-24 h-24 border-4 border-red-400 hover:cursor-pointer rounded-full relative"
            onClick={() => {
              if (turn.name === player.name) {
                selectCell(`${enemyPosition.x}-${enemyPosition.y}`, player);
              } else {
                selectCell(`${playerPosition.x}-${playerPosition.y}`, enemy);
              }
            }}
          >
            <img
              src="./images/bouftou.png"
              className="absolute top-[-53%] left-[-27%] h-[165%] max-w-[101%] transform rotate-[-30deg] skew-x-[20deg]"
            />
          </div>
        </motion.div>
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
