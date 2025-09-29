import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Page() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <section className="flex-1">
        <Sidebar />
      </section>
    </main>
  );
}
