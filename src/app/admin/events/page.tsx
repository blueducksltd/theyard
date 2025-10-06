import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import AdminCalendar from "@/components/dashboard/AdminCalender";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Events &amp; Calendar" />
      <section className="flex-1 flex">
        <Sidebar />
        <AdminCalendar />
      </section>
    </main>
  );
}
