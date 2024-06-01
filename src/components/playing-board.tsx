import { motion } from "framer-motion";
import { usePlayingBoard } from "../hooks/usePlayingBoard";
import { Board } from "../types/board";
import { Player } from "../types/player";
import PlayerInfo from "./player-info";
import PlayerTurnImage from "./player-turn-image";

const player: Player = {
  name: "Skyouuh",
  pv: 100,
  pm: 3,
  pa: 6,
};

const enemy: Player = {
  name: "Bouftou",
  pv: 30,
  pm: 3,
  pa: 6,
};

const board: Board = {
  name: "main",
  width: 8,
  length: 8,
};

export default function PlayingBoard() {
  const [
    isUserImageDisplayed,
    playerPosition,
    enemyPosition,
    passTurn,
    grid,
    turn,
    selectCell,
  ] = usePlayingBoard(player, enemy, board);

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
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-24 h-24 bg-blue-400 hover:cursor-pointer"
            onClick={() => {
              if (turn.name === player.name) {
                selectCell(`${enemyPosition.x}-${enemyPosition.y}`, player);
              } else {
                selectCell(`${playerPosition.x}-${playerPosition.y}`, enemy);
              }
            }}
          />
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{
            top: enemyPosition.x * 6 + "rem",
            left: enemyPosition.y * 6 + "rem",
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-red-400 hover:cursor-pointer" />
        </motion.div>
        <div>
          <button
            type="button"
            className="border-2 w-36 h-12 hover:scale-110 transition-all delay-[10ms] hover:bg-gray-800"
            onClick={() => passTurn(turn.name)}
          >
            Passer le tour
          </button>
        </div>
      </div>
    </div>
  );
}
