import { useEffect, useState } from "react";
import { useStore } from "../hooks/store";
import { ChatInfoMessage } from "../types/chat-info-message";
import { playAudio } from "../utils/music/handleAudio";
import { getRandomInt } from "../utils/tools/getRandomNumber";
import { reloadPage } from "../utils/tools/windowControls";
import ActionBar from "./action-bar";
import PlayingBoard from "./playing-board";

export default function Main() {
  const music1 = "./33_fig_otomai.mp3.mp3";
  const music2 = "./36_fig_cania.mp3.mp3";
  const music3 = "./37_fig_amakna.mp3.mp3";
  const musics = [music1, music2, music3];
  const isGameOver = useStore((state) => state.isGameOver);
  const [turnCount, setTurnCount] = useState<number>(1);
  const [boostDuration, setBoostDuration] = useState<number>();
  const [messages, setMessages] = useState<ChatInfoMessage[]>([
    {
      type: "Info",
      message: "Le combat commence",
    },
  ]);

  useEffect(() => {
    playAudio(musics[getRandomInt(musics.length)], 0.1, true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900 relative">
      {!isGameOver ? (
        <>
          <PlayingBoard
            setMessages={setMessages}
            setTurnCount={setTurnCount}
            turnCount={turnCount}
            setBoostDuration={setBoostDuration}
            boostDuration={boostDuration}
          />
          <ActionBar messages={messages} boostDuration={boostDuration} />
          <div className="absolute top-2 right-0 border-2 w-14 h-14 text-white flex justify-center items-center font-bold text-xl border-r-0 rounded-tl-lg rounded-bl-lg">
            {turnCount}
          </div>
        </>
      ) : (
        <div className="text-white flex flex-col justify-center items-center">
          <div className="m-10 text-3xl  font-bold">Game Over !</div>
          <div>
            <button
              className="border-2 w-fit h-14 p-3 hover:scale-110 transition hover:bg-gray-600"
              onClick={reloadPage}
            >
              Recommencer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
