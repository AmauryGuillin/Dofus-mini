import { useEffect, useRef } from "react";
import { ChatInfoMessage } from "../types/chat-info-message";

type Props = {
  messages: ChatInfoMessage[];
};

export default function Chat({ messages }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div className="overflow-y-scroll text-lg pt-2 pl-4 bg-slate-950 h-full">
      {messages.map((message, index) => (
        <div key={index}>
          <span
            className={
              message.type === "Info" ? "text-green-500" : "text-red-500"
            }
          >
            [{message.type}]:&nbsp;
          </span>
          <span
            className={
              message.type === "Info" ? "text-green-500" : "text-red-500"
            }
          >
            {message.message}
          </span>
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
}
