"use client";
import React from "react";
import toast from "react-hot-toast";

interface Image {
  revised_prompt: string;
  url: string;
}

export default function Page() {
  const [prompt, setPrompt] = React.useState("");
  const [images, setImages] = React.useState<Image[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [model, setModel] = React.useState("dall-e-2");
  const [size, setSize] = React.useState("1024x1024");
  const [quality, setQuality] = React.useState("standard");
  const [n, setN] = React.useState(1);

  const handleSubmit = async () => {
    if (loading) return;

    const p = prompt.trim();

    if (!prompt) return toast.error("请输入文字");

    const params = {
      prompt: p,
      model,
      size,
      quality,
      n,
    };
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const images = await response.json();
      console.log(images)
      setPrompt("");
      setImages(images);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg m-auto py-10">
      <div className="mb-4 grid grid-cols-4 gap-4">
        <select
          value={model}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => setModel(e.target.value)}>
          <option value="dall-e-2">DALL-E-2</option>
          <option value="dall-e-3">DALL-E-3</option>
        </select>
        <select
          value={size}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => setSize(e.target.value)}>
          <option value="1024x1024">1024x1024</option>
          <option value="1024x1792">1024x1792</option>
          <option value="1792x1024">1792x1024</option>
        </select>
        <select
          value={quality}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => setQuality(e.target.value)}>
          <option value="standard">普通</option>
          <option value="hd">高清</option>
        </select>
        <div>
          <input
            type="range"
            min={0}
            max="4"
            value={n}
            onChange={(e) => setN(+e.target.value)}
            className="range"
            step="1"
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
        </div>
      </div>
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
          {loading ? <span className="loading loading-spinner"></span> : "提交"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            className="card card-compact w-96 bg-base-100 shadow-xl"
            key={index}>
            <figure>
              <img src={image.url} alt={image.revised_prompt } />
            </figure>
            {image.revised_prompt && (
              <div className="card-body">
                <p>{image.revised_prompt}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
