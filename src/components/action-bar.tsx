import { ChatInfoMessage } from "../types/chat-info-message";
import Chat from "./action-bar-chat";
import SpellBar from "./spell-bar";

type Props = {
  messages: ChatInfoMessage[];
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedSpell: number | undefined;
};

export default function ActionBar({
  messages,
  setSelectedSpell,
  selectedSpell,
}: Props) {
  return (
    <div className="border-t-8 rounded-tl-3xl rounded-tr-3xl border-gray-500 w-full h-64 overflow-hidden">
      <div className="flex justify-center items-start text-white h-full">
        <Chat messages={messages} />
        <div className="border-l-8 border-r-8 rounded-tl-2xl rounded-tr-2xl border-gray-500 w-[20%] h-64 text-center">
          information joueur
        </div>
        <div className="w-[40%] h-64">
          <SpellBar
            setSelectedSpell={setSelectedSpell}
            selectedSpell={selectedSpell}
          />
        </div>
      </div>
    </div>
  );
}
