import { useEffect } from "react";
import PlayingBoard from "./playing-board";
import SpellBar from "./spell-bar";

export default function Main() {
  const music1 = "./33_fig_otomai.mp3.mp3";
  const music2 = "./36_fig_cania.mp3.mp3";
  const music3 = "./37_fig_amakna.mp3.mp3";

  const musics = [music1, music2, music3];

  function getRandomInt() {
    return Math.floor(Math.random() * 3);
  }

  useEffect(() => {
    const music = document.createElement("audio");
    music.src = musics[getRandomInt()];
    music.autoplay = true;
    music.loop = true;
    music.volume = 0.1;
    document.body.appendChild(music);
  }, []);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      <PlayingBoard />
      <SpellBar />
    </div>
  );
}
