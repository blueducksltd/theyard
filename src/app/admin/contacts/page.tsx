import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ContactContent from "@/components/dashboard/ContactContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Customer's Data" />
      <section className="flex-1 flex">
        <Sidebar />
        <ContactContent />
      </section>
    </main>
  );
}
