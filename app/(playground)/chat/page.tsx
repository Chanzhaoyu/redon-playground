"use client";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import Image from "next/image";
import clsx from "clsx";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import Tokenizer from "@/components/Tokenizer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Send, Pause } from "lucide-react";
import { debounce } from "lodash-es";

export default function SloganGenerator() {
  const { messages, stop, input, isLoading, handleInputChange, handleSubmit } =
    useChat();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isAI = (role: string) => ["system", "assistant"].includes(role);

  const avatar = (role: string) => {
    if (isAI(role)) {
      return (
        <Image width={40} height={40} src="/images/avatar-ai.jpg" alt="AI" />
      );
    }
    return <Image width={40} height={40} src="/images/avatar.jpg" alt="User" />;
  };

  const debouncedSmoothScroll = debounce(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, 300);

  useEffect(() => {
    debouncedSmoothScroll();
  }, [debouncedSmoothScroll, messages]);

  const onHandleSubmit = (e: any) => {
    handleSubmit(e);
  };

  return (
    <div
      ref={scrollRef}
      className="w-full h-screen overflow-hidden overflow-y-auto">
      <div className="mx-auto w-full max-w-screen-lg h-full flex flex-col">
        <div className="flex-1 w-full whitespace-pre-wrap my-4 pt-20 pb-20">
          {messages.map((m) => (
            <div
              className={clsx("chat", isAI(m.role) ? "chat-start" : "chat-end")}
              key={m.id}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">{avatar(m.role)}</div>
              </div>
              <div className="chat-header flex items-center gap-2">
                {isAI(m.role) ? "Puppy AI" : "You"}
                <span className="text-xs text-neutral-400">
                  <Tokenizer text={m.content} />
                </span>
              </div>
              <div
                className={clsx(
                  ["chat-bubble my-2"],
                  !isAI(m.role) && "chat-bubble-info"
                )}>
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          style={darcula}
                          language={match[1]}
                          PreTag="div">
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}>
                  {m.content}
                </Markdown>
              </div>
              <div className="chat-footer opacity-50">
                <p>{m?.createdAt?.toLocaleTimeString()}</p>
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
                <Pause />
                Stop
              </button>
            </div>
          )}
        </div>
        <div className="w-full p-4 fixed left-0 bottom-0 bg-white">
          <form
            className="flex items-center space-x-4"
            onSubmit={onHandleSubmit}>
            <input
              className="input input-bordered w-full "
              value={input}
              placeholder="Ask me anything..."
              onChange={handleInputChange}
            />
            <button className="btn" type="submit" disabled={isLoading}>
              <Send />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
