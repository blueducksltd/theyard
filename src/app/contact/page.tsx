import Hero from "@/components/contact/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/contact/ContactForm";

export default function Page() {
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <Hero />
        <ContactForm />
      </section>
      {/*end of contact*/}

      <Footer />
    </main>
  );
}
