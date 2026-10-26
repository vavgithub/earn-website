import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PrincipleSection } from "@/components/home/PrincipleSection";
import { ReadingSection } from "@/components/home/ReadingSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ProofSection } from "@/components/home/ProofSection";
import { WorkSection } from "@/components/home/WorkSection";
import { WebsiteChrome } from "@/components/website/WebsiteChrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <WebsiteChrome>
      <HeroSection />
      <EcosystemSection />
      <ProductsSection />
      <PrincipleSection />
      <ArchitectureSection />
      <ProofSection />
      <WorkSection />
      <ReadingSection />
    </WebsiteChrome>
  );
}
