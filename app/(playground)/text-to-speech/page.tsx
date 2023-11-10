"use client";
import React from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [audio, setAudio] = React.useState<string | undefined>(undefined);
  const [input, setInput] = React.useState<string>("");

  const handleSubmit = async () => {
    if (loading) return;

    if (!prompt.trim()) return toast.error("请输入文字");

    try {
      setInput("");
      setLoading(true);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
      });
      const data = await response.json();
      setAudio(data.data);
      setInput(prompt);
      setPrompt("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg m-auto py-10">
      <div className="space-y-4">
        <h1 className="mb-4 text-xl">text to speech</h1>
        <div>{input}</div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            disabled={loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="btn"
            disabled={loading}
            onClick={() => handleSubmit()}>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "提交"
            )}
          </button>
        </div>
        {!loading && audio && (
          <div>
            <audio controls src={audio}></audio>
          </div>
        )}
      </div>
    </div>
  );
}
