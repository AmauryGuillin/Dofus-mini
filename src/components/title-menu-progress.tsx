import { useStore } from "@/hooks/store";
import { getRandomInt } from "@/utils/tools/getRandomNumber";
import { useEffect, useState } from "react";
import { ProgressLoading } from "./ui/progress-loading";

type Props = {
  isLoading: boolean;
};

export default function TitleMenuProgress({ isLoading }: Props) {
  const [loadingValue, setLoadingValue] = useState(0);
  const [loadingValue2, setLoadingValue2] = useState(0);

  const setGameStarted = useStore((state) => state.setGameStarted);

  const musics = [
    "/home-musics/39_loc_amakna.mp3.mp3",
    "/home-musics/48_loc_cania.mp3.mp3",
  ];

  const enemyImagesSourceUrl = [
    "./enemy-animations/bouftou-attack-left.gif",
    "./enemy-animations/bouftou-attack.gif",
    "./enemy-animations/bouftou-damage-left.gif",
    "./enemy-animations/bouftou-damage.gif",
    "./enemy-animations/bouftou-death-left.gif",
    "./enemy-animations/bouftou-death.gif",
    "./enemy-static/bouftou-left.png",
    "./enemy-static/bouftou.png",
  ];

  const playerImagesSourceUrl = [
    "./player-animations/attack-close-animation-1.gif",
    "./player-animations/attack-close-animation-left.gif",
    "./player-animations/boost-animation-left.gif",
    "./player-animations/boost-animation.gif",
    "./player-animations/death-animation-left.gif",
    "./player-animations/death-animation.gif",
    "./player-animations/hit-animation-left.gif",
    "./player-animations/hit-animation.gif",
    "./player-static/player-static-front-right.png",
    "./player-static/player-static-left.png",
  ];

  const loadingContent = [
    "images",
    "monstre",
    "monde",
    "sorts",
    "histoire",
    "textures",
    "sons",
    "musique",
    "objets",
    "quêtes",
    "dialogues",
    "cartes",
    "effets",
    "interfaces",
    "cinématiques",
    "scripts",
  ];

  const music = document.createElement("audio");
  useEffect(() => {
    music.src = musics[getRandomInt(musics.length)];
    music.autoplay = true;
    music.loop = true;
    music.volume = 0.1;
    document.body.appendChild(music);
    loadEntityAnimations();
  }, []);

  useEffect(() => {
    if (loadingValue === 100) setGameStarted(true);
    if (loadingValue === 100) {
      const audio = document.querySelector("audio");
      audio!.pause();
      audio!.currentTime = 0;
      return;
    }
  }, [loadingValue]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingValue((prevValue) => {
        if (prevValue >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevValue + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingValue2((prevValue) => {
        if (loadingValue === 100) {
          clearInterval(interval);
          return 100;
        }
        if (prevValue >= 100) {
          clearInterval(interval);
          return 0;
        }
        return prevValue + 3;
      });
    }, 1);

    return () => clearInterval(interval);
  }, [isLoading, loadingValue2]);

  async function loadEntityAnimations() {
    new Promise((resolve) => {
      enemyImagesSourceUrl.forEach((url) => {
        const img = new Image();
        img.src = url;
        img.onerror = () =>
          console.error(`Error when loading asset with url: ${url}`);
      });
      resolve("Bouftou assets fully loaded");
    });

    new Promise((resolve) => {
      playerImagesSourceUrl.forEach((url) => {
        const img = new Image();
        img.src = url;
        img.onerror = () =>
          console.error(`Error when loading asset with url: ${url}`);
      });
      resolve("Player assets fully loaded");
    });
  }

  return (
    <>
      {isLoading && (
        <>
          <div className="absolute bottom-[calc(100dvh-91dvh)] left-[50%] translate-x-[-50%] w-[20%] z-50">
            <ProgressLoading
              value={loadingValue}
              content="Loading"
            ></ProgressLoading>
          </div>
          <div className="absolute bottom-[calc(100dvh-95dvh)] left-[50%] translate-x-[-50%] w-[20%] z-50">
            <ProgressLoading
              value={loadingValue2}
              content={loadingContent[getRandomInt(loadingContent.length)]}
            ></ProgressLoading>
          </div>
          <div className="absolute top-[87%] left-[50%] translate-x-[-50%] h-[13dvh] w-1/4 bg-[#2D2D2D] rounded-tl-2xl rounded-tr-2xl border-t-[3px] border-x-[3px] border-[#A4A6A5]"></div>
        </>
      )}
    </>
  );
}
