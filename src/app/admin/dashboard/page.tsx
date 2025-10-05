import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import HomeContent from "@/components/dashboard/HomeContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header />
      <section className="flex-1 flex">
        <Sidebar />
        <HomeContent />
      </section>
    </main>
  );
}
