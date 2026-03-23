import Link from "next/link";
import { HeroSection } from "@/components/launch/HeroSection";
import { ServiceGrid } from "@/components/launch/ServiceGrid";
import { HowItWorks } from "@/components/launch/HowItWorks";
import { SocialProof } from "@/components/launch/SocialProof";
import { FAQSection } from "@/components/launch/FAQSection";
import { FinalCTA } from "@/components/launch/FinalCTA";

export default function HomePage() {
  return (
    <main className="app-shell">
      <HeroSection />
      <ServiceGrid />
      <HowItWorks />
      <SocialProof />
      <FAQSection />
      <FinalCTA />
      <footer className="container-page pt-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-4">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}
