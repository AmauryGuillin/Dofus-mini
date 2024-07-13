import { useStore } from "@/hooks/store";
import { Circle, Heart } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function PlayerInfo() {
  const player = useStore((state) => state.player);

  return (
    <>
      <div className="relative flex justify-center items-center h-full">
        <Avatar className="h-[calc(100vh-80vh)] w-[calc(100vw-87vw)] border-4">
          <AvatarImage src="./images/1.png" />
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
          <Circle
            strokeWidth={1.25}
            stroke="blue"
            className="absolute top-14 -left-[95px] -translate-x-1/2 -translate-y-1/2 size-16"
          />
          <span className="absolute top-14 -left-[96px] -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-blue-600">
            {player.pa}
          </span>
          <span className="absolute top-20 -left-[131px] -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-blue-600">
            PA
          </span>
          <Circle
            strokeWidth={1.25}
            stroke="green"
            className="absolute top-32 -left-[141px] -translate-x-1/2 -translate-y-1/2 size-16"
          />
          <span className="absolute top-32 -left-[141px] -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-green-500">
            {player.pm}
          </span>
          <span className="absolute top-40 -left-[176px] -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl text-green-500">
            PM
          </span>
        </div>
      </div>
    </>
  );
}
