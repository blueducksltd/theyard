import Footer from "@/components/Footer";
import Hero from "@/components/gallery/Hero";
import Navbar from "@/components/Navbar";
import Grid from "@/components/gallery/Grid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <Hero />
        <Grid />
      </section>

      <Footer />
    </main>
  );
}
