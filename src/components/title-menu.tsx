import { getRandomIntMinMax } from "@/utils/tools/getRandomNumber";
import { useState } from "react";
import TitleMenuProgress from "./title-menu-progress";
import { TitleMenuButton } from "./ui/title-menu-button";

export default function TitleMenu() {
  const [isLoading, setIsLoading] = useState(false);
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
      {isLoading && (
        <div className="absolute top-[85%] left-[50%] translate-x-[-50%] h-[15dvh] w-1/4 bg-[#2D2D2D] rounded-tl-2xl rounded-tr-2xl border-t-[3px] border-x-[3px] border-[#A4A6A5]"></div>
      )}
      <LoadingImage setIsLoading={setIsLoading} isLoading={isLoading} />
    </div>
  );
}

type Props = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoadingImage({ isLoading, setIsLoading }: Props) {
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
