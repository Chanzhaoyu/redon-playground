"use client";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import ImageViewer from "react-simple-image-viewer";
import Image from "next/image";
import { getImageLocale, setImageLocale } from "@/utils/imageLocale";

interface Image {
  revised_prompt?: string;
  url: string;
}

const dall2Options = ["256x256", "512x512", "1024x1024"];

const dall3Options = ["1024x1024", "1024x1792", "1792x1024"];

const list = getImageLocale();

export default function Page() {
  const [currentImage, setCurrentImage] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [images, setImages] = React.useState<Image[]>(list ?? []);
  const [loading, setLoading] = React.useState(false);

  const [model, setModel] = React.useState("dall-e-2");
  const [size, setSize] = React.useState("1024x1024");
  const [quality, setQuality] = React.useState("standard");
  const [n, setN] = React.useState(4);

  const qualityOptions =
    model === "dall-e-2" ? ["standard", "hd"] : ["standard"];

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
      saveImageToLocale(images);
      setPrompt("");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openImageViewer = useCallback((index: number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const saveImageToLocale = (images: any[]) => {
    setImages((prev) => {
      const newImages = [...images, ...prev];
      setImageLocale(images);
      setImageLocale(newImages);
      return newImages;
    });
  };

  const max = model === "dall-e-2" ? 10 : 1;

  useEffect(() => {
    if (model === "dall-e-3" && n > 1) {
      setN(1);
    }
  }, [model, n]);

  useEffect(() => {
    // if model is not dall-e-2, set size to 1024x1024
    if (size !== "1024x1024") {
      setSize("1024x1024");
    }
    // if quality is not standard, set it to standard
    if (model === "dall-e-2" && quality !== "standard") {
      setQuality("standard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const sizeOptions = model === "dall-e-2" ? dall2Options : dall3Options;

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
          {sizeOptions.map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
        <select
          value={quality}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => setQuality(e.target.value)}>
          {qualityOptions.map((quality) => (
            <option value={quality} key={quality}>
              {quality}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-x-4 my-4">
        <span className="-mt-2">{n}</span>
        <div className="flex-1">
          <input
            type="range"
            min={1}
            max={max}
            value={n}
            onChange={(e) => setN(+e.target.value)}
            className="range"
            step="1"
          />
        </div>
        <span className="-mt-2">Max: {max}</span>
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
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Generate"
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            className="card card-compact w-96 bg-base-100 shadow-xl"
            key={index}>
            <figure>
              <Image
                width={400}
                height={300}
                src={image.url}
                alt={image.revised_prompt ?? ""}
                onClick={() => openImageViewer(index)}
              />
            </figure>
            {image.revised_prompt && (
              <div className="card-body">
                <p>{image.revised_prompt}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images.map((image) => image.url)}
          currentIndex={currentImage}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
}
