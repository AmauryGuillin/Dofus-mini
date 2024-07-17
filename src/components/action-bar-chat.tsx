import { useEffect, useRef } from "react";
import { ChatInfoMessage } from "../types/chat-info-message";
import { Card, CardContent } from "./ui/card";

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
    <Card className="h-full bg-transparent">
      <CardContent className="h-full overflow-auto">
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
      </CardContent>
    </Card>
  );
}
