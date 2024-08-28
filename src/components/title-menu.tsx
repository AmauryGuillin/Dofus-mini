import { getRandomIntMinMax } from "@/utils/tools/getRandomNumber";
import { useState } from "react";
import TitleMenuProgress from "./title-menu-progress";
import { TitleMenuButton } from "./ui/title-menu-button";

export default function TitleMenu() {
  const random = getRandomIntMinMax(1, 17);

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
        className="absolute top-[50%] left-[50%] translate-x-[-50%]"
        onClick={startGame}
      >
        LANCER LA PARTIE
      </TitleMenuButton>
      <TitleMenuProgress isLoading={isLoading} />
    </>
  );
}
