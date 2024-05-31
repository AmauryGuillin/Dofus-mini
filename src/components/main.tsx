import { useEffect } from "react";
import PlayingBoard from "./playing-board";
import SpellBar from "./spell-bar";

export default function Main() {
  useEffect(() => {
    const music = document.createElement("audio");
    music.src = "./combat_music.mp3";
    music.autoplay = true;
    music.loop = true;
    music.volume = 0.05;
    document.body.appendChild(music);
  }, []);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      <PlayingBoard />
      <SpellBar />
    </div>
  );
}
