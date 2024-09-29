import PlayerInfo from "@/components/player-info.tsx";
import { useEffect, useState } from "react";
import { useStore } from "../hooks/store";
import { ChatInfoMessage } from "../types/chat-info-message";
import { playAudio } from "../utils/music/handleAudio";
import { getRandomInt } from "../utils/tools/randomGenerators";
import Chat from "./action-bar-chat";
import Changelog from "./changelog";
import GameOver from "./game-over";
import GameWin from "./game-win";
import PlayingBoard from "./playing-board";
import SpellBar from "./spell-bar";
import Timeline from "./timeline";

export default function Main() {
  const music1 = "./33_fig_otomai.mp3.mp3";
  const music2 = "./36_fig_cania.mp3.mp3";
  const music3 = "./37_fig_amakna.mp3.mp3";
  const music4 = "./24_loc_pandawafight.mp3.mp3";
  const musics = [music1, music2, music3, music4];

  const isGameOver = useStore((state) => state.isGameOver);
  const isGameWin = useStore((state) => state.isGameWin);
  const turnCount = useStore((state) => state.turnCount);

  const [messages, setMessages] = useState<ChatInfoMessage[]>([
    {
      type: "Info",
      message: "Le combat commence",
    },
  ]);

  useEffect(() => {
    playAudio(musics[getRandomInt(musics.length)], 0.1, true);
  }, []);

  if (isGameWin) return <GameWin />;

  if (isGameOver) return <GameOver />;

  return (
    <>
      <div className="w-[80dvw] mx-auto h-screen flex flex-col justify-center items-center bg-gray-900 relative">
        <Changelog />
        <div className="flex flex-1 items-center justify-center">
          <PlayingBoard setMessages={setMessages} />
        </div>
        <div className="flex gap-1 w-full mb-5 mr-5 justify-end items-center">
          <Timeline setMessage={setMessages} />
        </div>
        <div className="grid grid-cols-3 gap-6 w-full mx-auto max-h-full">
          <div className="flex flex-col h-44 md:h-52">
            <Chat messages={messages} />
          </div>
          <div className="flex flex-col h-44 md:h-52 items-center justify-center">
            <PlayerInfo />
          </div>
          <div className="flex flex-col h-44 md:h-52">
            <SpellBar />
          </div>
        </div>
        <div className="absolute top-2 right-0 border-2 w-14 h-14 text-white flex justify-center items-center font-bold text-xl border-r-0 rounded-tl-lg rounded-bl-lg">
          {turnCount}
        </div>
      </div>
    </>
  );
}
