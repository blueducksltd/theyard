import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/services/Hero";
import Services from "@/components/services/Services";

export default function Page() {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <Hero />
        <Services />
      </section>
      {/*end of contact*/}

      <Footer />
    </main>
  );
}
