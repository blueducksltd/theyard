import { IBooking } from "@/types/Booking";
import dayjs from "dayjs";

// Day view: group bookings by day (no time slots)
export function groupBookingsByDay(bookings: IBooking[], date: Date) {
    return bookings
        .filter(b => dayjs(b.eventDate).isSame(date, "day"))
        .map(b => ({
            ...b.toObject(),
            start: dayjs(b.eventDate).hour(9).minute(0).second(0).toDate(), // Default day start
            end: dayjs(b.eventDate).hour(18).minute(0).second(0).toDate(), // Default day end
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Month view: group bookings by day
export function groupBookingsByMonth(bookings: IBooking[], month: Date) {
    return bookings
        .filter(b => dayjs(b.eventDate).isSame(month, "month"))
        .map(b => ({
            ...b.toObject(),
            start: dayjs(b.eventDate).hour(9).minute(0).second(0).toDate(),
            end: dayjs(b.eventDate).hour(18).minute(0).second(0).toDate(),
        }))
        .reduce((acc, b) => {
            const day = dayjs(b.eventDate).format("YYYY-MM-DD");
            acc[day] = acc[day] || [];
            acc[day].push(b);
            return acc;
        }, {} as Record<string, IBooking[]>);
}

// For day-based bookings, use default hours
export function combineDateTime(date: Date, _time: string): Date {
    return dayjs(date).hour(9).minute(0).second(0).toDate();
}
