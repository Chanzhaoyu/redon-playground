import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const request = await req.json();

  const {
    prompt = "",
    model = "dall-e-2",
    size = "1024*1024",
    quality = "standard",
    n = 1,
  } = request;

  console.log(request);

  if (!prompt || prompt.trim() === "")
    return Response.json({ error: "prompt 不能为空" }, { status: 400 });

  try {
    const response = await openai.images.generate({
      model,
      prompt,
      size,
      quality,
      n,
    });
    return Response.json(response.data);
  } catch (e: any) {
    console.error(e);
    return Response.json({ ...e }, { status: 500 });
  }
}
