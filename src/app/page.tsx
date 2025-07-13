import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { CTA } from "@/components/sections/cta";
import { VideoBackground } from "@/components/layout/video-background";

export default function Home() {
  return (
    <div className="relative">
      {/* Video Background - Only for Home Page */}
      <VideoBackground />

      {/* Page Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <CTA />
      </div>
    </div>
  );
}
