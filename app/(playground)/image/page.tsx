import type { Metadata } from "next";
import Playground from "./playground";

export const metadata: Metadata = {
  title: "Image | Playground",
  description: "DALL-E-2 & DALL-E-3 Playground",
};

const Page = () => {
  return <Playground />;
};

export default Page;
