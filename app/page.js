import Nav from "@/components/site/nav";
import Hero from "@/components/site/hero";
import Marquee from "@/components/site/marquee";
import Services from "@/components/site/services";
import Work from "@/components/site/work";
import Why from "@/components/site/why";
import Process from "@/components/site/process";
import Founder from "@/components/site/founder";
import CraftAi from "@/components/site/craft-ai";
import Pricing from "@/components/site/pricing";
import Faq from "@/components/site/faq";
import Contact from "@/components/site/contact";
import Footer from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        {/* Single animated blue/gray separator right under the hero */}
        <div aria-hidden="true" className="edge-flow relative h-[2px] w-full" />
        <Marquee />
        <Services />
        <Work />
        <Why />
        <Process />
        <Founder />
        <CraftAi />
        <Pricing />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
