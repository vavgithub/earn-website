import { WebsiteChrome } from "@/components/website/WebsiteChrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <WebsiteChrome>
      <main className="max-w-content mx-auto w-full px-5 py-16">
        <h1 className="font-inter text-3xl m-0">Earn</h1>
      </main>
    </WebsiteChrome>
  );
}
