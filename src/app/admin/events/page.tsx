import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import AdminCalendar from "@/components/dashboard/AdminCalender";
import { IBooking } from "@/types/Booking";
import { getBookings } from "@/util";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const bookingData: IBooking[] = (await getBookings()).data.bookings;
  return (
    <main className="flex flex-col h-screen bg-[#fdfbf9]">
      <Header section="Events &amp; Calendar" />
      <section className="flex-1 flex">
        <Sidebar />
        <AdminCalendar bookingData={bookingData} />
      </section>
    </main>
  );
}
