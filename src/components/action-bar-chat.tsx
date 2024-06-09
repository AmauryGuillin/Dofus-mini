import { ChatInfoMessage } from "../types/chat-info-message";

type Props = {
  messages: ChatInfoMessage[];
};

export default function Chat({ messages }: Props) {
  return (
    <>
      <div className="w-[40%] h-full flex flex-col overflow-y-scroll text-lg pt-2 pl-4 bg-slate-950">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <span
                className={`${
                  message.type === "Info" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message.type}:
              </span>
              <span
                className={`${
                  message.type === "Info" ? "text-green-500" : "text-red-500"
                }`}
              >
                {" "}
                {message.message}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
