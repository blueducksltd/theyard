import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Upcoming from "@/components/Upcoming";

export default function Home() {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"pt-20 px-4 md:px-16 w-full"}>
        <Hero />
        <Introduction />
        <Featured />
        <Upcoming />
        <Testimonials />
        <Gallery />
      </section>

      <Footer />
    </main>
  );
}
