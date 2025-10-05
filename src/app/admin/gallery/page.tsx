import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import GalleryContent from "@/components/dashboard/GalleryContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Gallery" />
      <section className="flex-1 flex">
        <Sidebar />
        <GalleryContent />
      </section>
    </main>
  );
}
