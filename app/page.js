import Nav from "@/components/site/nav";
import Hero from "@/components/site/hero";
import Pain from "@/components/site/pain";
import Burden from "@/components/site/burden";
import Compare from "@/components/site/compare";
import Marquee from "@/components/site/marquee";
import Services from "@/components/site/services";
import Work from "@/components/site/work";
import Apps from "@/components/site/apps";
import Why from "@/components/site/why";
import Process from "@/components/site/process";
import Founder from "@/components/site/founder";
import CraftAi from "@/components/site/craft-ai";
import ForYouIf from "@/components/site/for-you-if";
import Pricing from "@/components/site/pricing";
import Faq from "@/components/site/faq";
import Contact from "@/components/site/contact";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        {/* Single animated blue/gray separator right under the hero */}
        <div aria-hidden="true" className="edge-flow relative h-[2px] w-full" />
        <Pain />
        <Burden />
        <Compare />
        <Marquee />
        <Services />
        <Work />
        <Why />
        <Process />
        <Founder />
        <CraftAi />
        <ForYouIf />
        <Apps />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
