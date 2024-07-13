import { useStore } from "@/hooks/store";
import { Heart } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function PlayerInfo() {
  const player = useStore((state) => state.player);

  return (
    <>
      <div className="relative flex justify-center items-center h-full">
        <Avatar className="h-[calc(100vh-82vh)] w-[calc(100vw-90vw)] border-4">
          <AvatarImage src="./images/1.png" />
        </Avatar>
        <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Heart strokeWidth={1} className="size-24 fill-red-600" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] font-semibold text-2xl">
            {player.pv}
          </span>
        </div>
      </div>
    </>
  );
}
