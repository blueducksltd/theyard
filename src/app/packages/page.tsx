import Hero from "@/components/packages/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Vision from "@/components/about/Vision";
import Space from "@/components/about/Space";

const Page = () => {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <Hero />
      </section>

      <Footer />
    </main>
  );
};

export default Page;
