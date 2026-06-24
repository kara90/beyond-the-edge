import Nav from "@/components/site/nav";
import Hero from "@/components/site/hero";
import Marquee from "@/components/site/marquee";
import Services from "@/components/site/services";
import Work from "@/components/site/work";
import Why from "@/components/site/why";
import Process from "@/components/site/process";
import Founder from "@/components/site/founder";
import Pricing from "@/components/site/pricing";
import Faq from "@/components/site/faq";
import Contact from "@/components/site/contact";
import Footer from "@/components/site/footer";
import RockDivider, { ROCK_SRCS } from "@/components/site/rock-divider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Why />
        <Process />
        <RockDivider src={ROCK_SRCS[0]} size={132} />
        <Founder />
        <RockDivider src={ROCK_SRCS[1]} size={112} />
        <Pricing />
        <RockDivider src={ROCK_SRCS[2]} size={122} />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
