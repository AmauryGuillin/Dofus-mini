import { getRandomIntMinMax } from "@/utils/tools/getRandomNumber";
import { useEffect, useState } from "react";
import TitleMenuProgress from "./title-menu-progress";
import { TitleMenuButton } from "./ui/title-menu-button";

export default function TitleMenu() {
  const random = getRandomIntMinMax(1, 17);

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

  useEffect(() => {
    loadEntityAnimations();
  }, []);

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
    <div className="w-[80dvw] mx-auto h-screen flex justify-center items-center relative border-x-white border-x-4">
      <img
        src={`/loading-screens/${random}.png`}
        alt="loading screen"
        className="h-full w-full object-fill"
      />
      <img
        src="./images/title-screen-logo.png"
        alt="title screen logo"
        className="z-50 absolute top-[2%] left-[15%] translate-x-[-50%] size-1/4"
      />
      <LoadingImage />
    </div>
  );
}

function LoadingImage() {
  const [isLoading, setIsLoading] = useState(false);
  async function startGame() {
    setIsLoading(true);
  }
  return (
    <>
      <TitleMenuButton
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        onClick={startGame}
      >
        LANCER LA PARTIE
      </TitleMenuButton>
      <TitleMenuProgress isLoading={isLoading} />
    </>
  );
}
