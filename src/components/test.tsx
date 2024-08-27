import { getRandomIntMinMax } from "@/utils/tools/getRandomNumber";
import { useState } from "react";
import LoadingProgress from "./Loading-Progress";
import { Button } from "./ui/button";

export default function Test() {
  const random = getRandomIntMinMax(1, 17);

  return (
    <div className="w-[80dvw] mx-auto h-screen flex justify-center items-center relative border-x-white border-x-4">
      <img
        src={`/loading-screens/${random}.png`}
        alt="loading screen"
        className="h-full w-full object-fill"
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
      <Button
        className="absolute top-[50%] left-[50%] translate-x-[-50%]"
        onClick={startGame}
      >
        Lancer la partie
      </Button>
      <LoadingProgress isLoading={isLoading} />
    </>
  );
}
