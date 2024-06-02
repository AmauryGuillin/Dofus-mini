import { useEffect, useState } from "react";
import { ChatInfoMessage } from "../types/chat-info-message";
import { playAudio } from "../utils/music/handleAudio";
import { getRandomInt } from "../utils/tools/getRandomNumber";
import ActionBar from "./action-bar";
import PlayingBoard from "./playing-board";

export default function Main() {
  const music1 = "./33_fig_otomai.mp3.mp3";
  const music2 = "./36_fig_cania.mp3.mp3";
  const music3 = "./37_fig_amakna.mp3.mp3";
  const musics = [music1, music2, music3];
  useEffect(() => {
    playAudio(musics[getRandomInt(musics.length)], 0.1, true);
  }, []);

  const [messages, setMessages] = useState<ChatInfoMessage[]>([
    {
      type: "Info",
      message: "Le combat commence",
    },
  ]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      <PlayingBoard setMessages={setMessages} />
      <ActionBar messages={messages} />
      {/* <SpellBar /> */}
    </div>
  );
}
