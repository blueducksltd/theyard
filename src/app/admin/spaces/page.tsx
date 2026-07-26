import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import SpacesContent from "@/components/dashboard/SpacesContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Spaces Management" />
      <section className="flex-1 flex overflow-hidden">
        <Sidebar />
        <SpacesContent />
      </section>
    </main>
  );
}
