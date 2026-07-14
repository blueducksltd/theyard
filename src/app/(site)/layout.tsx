import type { Metadata } from "next";
import Header from "@/components/v2/Header";
import Footer from "@/components/v2/Footer";



export const metadata: Metadata = {
  title: "The Yard",
  description:
    "The Yard Picnic Park Enugu – a serene outdoor venue for picnics, parties & intimate events.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="bg-[#F6F2EC] pb-40">

        {children}
      </div>
      <Footer />
    </div>
  );
}
