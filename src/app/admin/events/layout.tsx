import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import AdminCalendar from "@/components/dashboard/AdminCalender";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({children}: {children: React.ReactNode}) {
  return (
    <main className="flex flex-col h-screen bg-yard-white">
      <Header section="Events &amp; Calendar" />
      <section className="flex-1 flex">
        <Sidebar />
        {children}
      </section>
    </main>
  );
}
