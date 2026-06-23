import Nav from "@/components/site/nav";
import Hero from "@/components/site/hero";
import Marquee from "@/components/site/marquee";
import Services from "@/components/site/services";
import Work from "@/components/site/work";
import Why from "@/components/site/why";
import Pricing from "@/components/site/pricing";
import Contact from "@/components/site/contact";
import Footer from "@/components/site/footer";

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
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
