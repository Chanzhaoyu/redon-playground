"use client";

import { useChat } from "ai/react";
import Image from "next/image";
import clsx from "clsx";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export default function SloganGenerator() {
  const { messages, stop, input, isLoading, handleInputChange, handleSubmit } =
    useChat();

  const isAI = (role: string) => ["system", "assistant"].includes(role);

  const avatar = (role: string) => {
    if (isAI(role)) {
      return (
        <Image width={40} height={40} src="/images/avatar-ai.jpg" alt="AI" />
      );
    }
    return <Image width={40} height={40} src="/images/avatar.jpg" alt="User" />;
  };

  return (
    <div className="w-full h-screen">
      <div className="mx-auto w-full max-w-screen-lg h-full flex flex-col">
        <div className="flex-1 w-full whitespace-pre-wrap my-4 pt-10">
          {messages.map((m) => (
            <div
              className={clsx("chat", isAI(m.role) ? "chat-start" : "chat-end")}
              key={m.id}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">{avatar(m.role)}</div>
              </div>
              <div className="chat-header">
                {isAI(m.role) ? "Puppy AI" : "You"}
              </div>
              <div
                className={clsx(
                  ["chat-bubble my-2"],
                  !isAI(m.role) && "chat-bubble-info"
                )}>
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}>
                  {m.content}
                </Markdown>
              </div>
              <div className="chat-footer opacity-50">
                {m?.createdAt?.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div>
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <button className="btn btn-error" onClick={() => stop()}>
                Stop
              </button>
            </div>
          )}
        </div>
        <div className="w-full pb-8">
          <form className="flex items-center space-x-4" onSubmit={handleSubmit}>
            <input
              className="input input-bordered w-full "
              value={input}
              placeholder="Ask me anything..."
              onChange={handleInputChange}
            />
            <button className="btn" type="submit" disabled={isLoading}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
