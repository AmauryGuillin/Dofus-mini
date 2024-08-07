import { useStore } from "@/hooks/store";
import { Circle, Heart } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function PlayerInfo() {
  const player = useStore((state) => state.player);

  return (
    <>
      <div className="relative">
        <Avatar className="h-auto w-44 border-4 shrink flex items-center justify-center">
          <AvatarImage src="./images/1.png" className="h-auto max-w-full" />
        </Avatar>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default">
          <Heart
            strokeWidth={0.7}
            stroke="white"
            className="size-24 fill-red-600"
          />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] font-extrabold text-2xl">
            {player.pv}
          </span>
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
