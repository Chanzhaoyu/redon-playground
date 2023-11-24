import React from "react";
import Link from "next/link";
import clsx from "clsx";

export default function Page() {
  const menus = [
    { name: "Chat", path: "/chat" },
    { name: "Image", path: "/image" },
    { name: "Text to speech", path: "/text-to-speech" },
    { name: "Speech to text", path: "/speech-to-text" },
    { name: "Tailwindcss", path: "/tailwindcss" },
  ];
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-screen-lg">
          <h1 className={clsx("text-5xl font-bold uppercase")}>Playground</h1>
          <p className="py-6">用于测试功能～</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {menus.map((menu) => (
              <Link href={menu.path} key={menu.path}>
                <button className="btn">{menu.name}</button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
