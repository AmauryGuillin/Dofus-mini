import PlayingBoard from "./playing-board";
import SpellBar from "./spell-bar";

export default function Main() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      <PlayingBoard />
      <SpellBar />
    </div>
  );
}
