
import AdminCalendar from "@/components/dashboard/AdminCalender";
import { IBooking } from "@/types/Booking";
import { getBookings } from "@/util";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const bookingData: IBooking[] = (await getBookings()).data.bookings;
  return (

    <AdminCalendar bookingData={bookingData} />

  );
}
