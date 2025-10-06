import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import PackagesContent from "@/components/dashboard/packages/PackagesContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Packages and Services" />
      <section className="flex-1 flex">
        <Sidebar />
        <PackagesContent />
      </section>
    </main>
  );
}
