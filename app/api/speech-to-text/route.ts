import OpenAI from "openai";
import fs from "fs";
import { exec } from "child_process";

const util = require("util");
const execAsync = util.promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const req = await request.json();

  const base64Audio = req.audio;

  if (!base64Audio || base64Audio.trim() === "") {
    return Response.json({ error: "audio 不能为空" }, { status: 400 });
  }

  const audio = Buffer.from(base64Audio, "base64");
  try {
    const text = await convertAudioToText(audio);
    return Response.json({ result: text }, { status: 200 });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return Response.json({ error: error.response.data }, { status: 400 });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return Response.json(
        { error: "An error occurred during your request." },
        { status: 500 }
      );
    }
  }
}

async function convertAudioToText(audioData: Buffer) {
  const mp3AudioData = await convertAudioToMp3(audioData);
  const outputPath = "./public/mp3/output.mp3";
  fs.writeFileSync(outputPath, mp3AudioData);
  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream(outputPath),
  });
  fs.unlinkSync(outputPath);
  const transcribedText = (response as any).data.text;
  return transcribedText;
}

async function convertAudioToMp3(audioData: Buffer) {
  const inputPath = "./public/mp3/input.mp3";
  fs.writeFileSync(inputPath, audioData);
  const outputPath = "./public/mp3/output.mp3";
  await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);
  const mp3AudioData = fs.readFileSync(outputPath);
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  return mp3AudioData;
}
