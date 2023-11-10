import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = "./public/mp3/speech.mp3";

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input || input.trim() === "")
    return Response.json({ error: "input 不能为空" }, { status: 400 });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input,
  });

  console.log(speechFile);

  const buffer = Buffer.from(await mp3.arrayBuffer());

  await fs.promises.writeFile(speechFile, buffer);

  return Response.json(
    { message: "success", data: "/mp3/speech.mp3" },
    { status: 200 }
  );
}
