import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ReviewContent from "@/components/dashboard/ReviewContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Reviews" />
      <section className="flex-1 flex">
        <Sidebar />
        <ReviewContent />
      </section>
    </main>
  );
}
