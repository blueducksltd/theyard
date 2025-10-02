import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import BookingContent from "@/components/dashboard/BookingContent";

export default function Page() {
  return (
    <main className="flex flex-col h-screen">
      <Header section="Booking Mgt" />
      <section className="flex-1 flex">
        <Sidebar />
        <BookingContent />
      </section>
    </main>
  );
}
