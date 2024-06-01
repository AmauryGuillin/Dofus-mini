import SpellBar from "./spell-bar";

type Props = {
  messages: string[];
};

export default function ActionBar({ messages }: Props) {
  return (
    <div className="border-t-2 w-full h-fit overflow-hidden">
      <div className="flex justify-center items-start text-white">
        <div className="w-[40%] h-36 flex flex-col overflow-y-auto pl-1 text-lg">
          {messages.map((message, index) => {
            return <span key={index}>{message}</span>;
          })}
        </div>
        <div className="border-l-2 border-r-2 w-[20%] h-64">
          information joueur
        </div>
        <div className="w-[40%] h-64">
          <SpellBar />
        </div>
      </div>
    </div>
  );
}
