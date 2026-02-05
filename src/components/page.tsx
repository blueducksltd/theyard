import Hero from "@/components/packages/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPackages } from "@/util";
import { IPackage } from "@/types/Package";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
  const packages: IPackage[] = (await getPackages()).data.packages;
  return (
    <main className={"w-full h-max bg-yard-white"}>
      <Navbar />

      {/*Content */}
      <section className={"py-20 px-4 md:px-16 w-full"}>
        <Hero packages={packages} />
      </section>

      <Footer />
    </main>
  );
};

export default Page;
