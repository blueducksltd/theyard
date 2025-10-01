import { IBooking } from "@/types/Booking";
import dayjs from "dayjs";

// Day view: group bookings by hour
export function groupBookingsByDay(bookings: IBooking[], date: Date) {
    return bookings
        .filter(b => dayjs(b.eventDate).isSame(date, "day"))
        .map(b => ({
            ...b.toObject(),
            start: combineDateTime(b.eventDate, b.startTime),
            end: combineDateTime(b.eventDate, b.endTime),
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Month view: group bookings by day
export function groupBookingsByMonth(bookings: IBooking[], month: Date) {
    return bookings
        .filter(b => dayjs(b.eventDate).isSame(month, "month"))
        .map(b => ({
            ...b.toObject(),
            start: combineDateTime(b.eventDate, b.startTime),
            end: combineDateTime(b.eventDate, b.endTime),
        }))
        .reduce((acc, b) => {
            const day = dayjs(b.eventDate).format("YYYY-MM-DD");
            acc[day] = acc[day] || [];
            acc[day].push(b);
            return acc;
        }, {} as Record<string, IBooking[]>);
}

export function combineDateTime(date: Date, time: string): Date {
    return dayjs(date)
        .hour(parseInt(time.split(":")[0], 10))
        .minute(parseInt(time.split(":")[1], 10))
        .second(0)
        .toDate();
}
