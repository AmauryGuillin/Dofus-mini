import { useStore } from "@/hooks/store";
import { playClickSounds } from "@/utils/music/handleAudio";
import { Circle, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export default function PlayerInfo() {
  const player = useStore((state) => state.player);
  const healthPercentage = Math.round(
    Math.min((player.pv / player.pvMax) * 100, 100)
  );

  const [healthParamFirst, setHealthParamFirst] = useState<number>(0);
  const [healthParamSecond, setHealthParamSecond] = useState<number>(0);

  useEffect(() => {
    if (healthPercentage >= 50) {
      const t =
        Math.round(Math.min((player.pv / 2 / (player.pvMax / 2)) * 100, 100)) -
        100;
      setHealthParamFirst(t);
    }
  }, [healthPercentage]);

  useEffect(() => {
    if (healthPercentage < 50) {
      const t =
        Math.round(Math.min((player.pv / player.pvMax) * 100, 100)) - 50;
      setHealthParamSecond(t);
      setHealthParamFirst(-50);
    }
  }, [healthPercentage, healthParamSecond]);

  const [healthDisplay, setHealthDisplay] = useState<number>(0);

  function changeHealthDisplay() {
    playClickSounds(0.5);
    setHealthDisplay((prev) => (prev + 1) % 3);
  }

  return (
    <>
      <svg width="0" height="0">
        <linearGradient
          id="health-gradient"
          x1="100%"
          y1={`${healthPercentage > 0 ? `${-healthParamSecond * 2}%}` : "99%"}`}
          x2="100%"
          y2={`${healthPercentage > 0 ? `${-healthParamFirst * 2}%` : "100%"}`}
        >
          <stop stopColor="#FFFF66" offset="50%" />
          <stop stopColor="#D60201" offset="50%" />
        </linearGradient>
      </svg>
      <div className="relative">
        <Avatar className="h-auto w-44 border-4 shrink flex items-center justify-center">
          <AvatarImage src="./images/1.png" className="h-auto max-w-full" />
        </Avatar>
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onClick={changeHealthDisplay}
        >
          <Heart
            style={{ fill: "url(#health-gradient)" }}
            strokeWidth={0.7}
            stroke="white"
            className="size-24"
          />
          {healthDisplay === 0 ? (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] font-extrabold text-2xl">
              {player.pv > 0 ? player.pv : 0}
            </span>
          ) : healthDisplay === 1 ? (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] font-extrabold text-lg">
              <div className="flex justify-center items-center flex-col">
                {player.pv > 0 ? player.pv : 0} <Separator /> {player.pvMax}
              </div>
            </span>
          ) : (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] font-extrabold text-xl">
              {healthPercentage > 0 ? healthPercentage : 0}%
            </span>
          )}
        </div>
        <div className="cursor-default">
          <Circle
            strokeWidth={1.25}
            stroke="blue"
            className="absolute top-3 left-0 -translate-x-1/2 -translate-y-1/2 size-16"
          />
          <span className="absolute top-3 left-0 -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-blue-600">
            {player.pa}
          </span>
        </div>
        <div className="cursor-default">
          <Circle
            strokeWidth={1.25}
            stroke="green"
            className="absolute top-20 -left-7 -translate-x-1/2 -translate-y-1/2 size-16"
          />
          <span className="absolute top-20 -left-7 -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-green-500">
            {player.pm}
          </span>
        </div>
      </div>
    </>
  );
}
