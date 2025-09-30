import Hero from "@/components/booking/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Page = () => {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"pt-20 px-4 md:px-16 w-full"}>
        <Hero />
      </section>

      <Footer />
    </main>
  );
};

export default Page;
