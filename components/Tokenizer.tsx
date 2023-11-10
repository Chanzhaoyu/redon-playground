import { encode } from "gpt-tokenizer";

export default function Tokenizer({ text }: { text: string }) {
  const tokens = () => {
    if (typeof text === "string" && text.trim() !== "") {
      return encode(text).length;
    }
  };
  return <span>{tokens()}</span>;
}
