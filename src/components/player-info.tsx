import { Player } from "../types/player";

type Props = {
  player: Player;
};

export default function PlayerInfo({ player }: Props) {
  return (
    <>
      <div className="absolute top-[75%] left-[87%] border-2 w-[10%] h-[20%] p-2 rounded-lg">
        <div>{player.name}</div>
        <div>PV: {player.pv}</div>
        <div>PA: {player.pa}</div>
        <div>PM: {player.pm}</div>
      </div>
    </>
  );
}
