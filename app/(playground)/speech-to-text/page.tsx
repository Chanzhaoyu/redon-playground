"use client";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function Page() {
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = () => {
            chunks.current = [];
          };
          newMediaRecorder.ondataavailable = (e) => {
            chunks.current.push(e.data);
          };
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onerror = function (err) {
              console.error("Error playing audio:", err);
            };
            audio.play();
            try {
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async function () {
                console.log(reader.result);
                const base64Audio = (reader.result as string).split(",")[1];
                const response = await fetch("/api/speech-to-text", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ audio: base64Audio }),
                });
                const data = await response.json();
                if (response.status !== 200) {
                  throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                  );
                }
                setResult(data.result);
              };
            } catch (error) {
              console.error(error);
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="max-w-screen-lg m-auto py-10">
      <div className="space-y-4">
        <h1 className="text-xl">speech to text</h1>
        <button
          className={clsx("btn", recording && "btn-error")}
          onClick={recording ? stopRecording : startRecording}>
          {recording ? <StopSvg /> : <StartSvg />}
          {recording ? "停止" : "开始"}
        </button>
        <div>{result}</div>
      </div>
    </div>
  );
}

const StartSvg = () => {
  return (
    <svg
      className="inline-block w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24">
      <path d="M16.3944 11.9998L10 7.73686V16.2628L16.3944 11.9998ZM19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"></path>
    </svg>
  );
};

const StopSvg = () => {
  return (
    <svg
      className="inline-block w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24">
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H11V15H9V9ZM13 9H15V15H13V9Z"></path>
    </svg>
  );
};
