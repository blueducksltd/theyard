import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import Package from "@/models/Package";
import Review from "@/models/Review";
import { NextRequest } from "next/server";


export const GET = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        const payload = requireAuth(request);

        if (!requireRole(payload, "admin", "manager")) {
            throw APIError.Forbidden("No permission to access this endpoint");
        }

        //  Bookings stats
        const activeBookings = await Booking.find({ status: "confirmed" }).sort({ createdAt: -1 })
            .populate("event")
            .populate("space")
            .populate("customer");
        const activeCount = activeBookings.length;
        // Get last 2 active bookings
        const bookings = activeBookings.slice(0, 2);
        const _bookings = bookings.map(booking => ({
            id: booking.id,
            space: booking.space.name,
            name: booking.customer ? `${booking.customer.firstname} ${booking.customer.lastname}` : "N/A",
            date: booking.eventDate,
            time: `${booking.event.time.start} - ${booking.event.time.end}`,
            duration: getDuration(booking.event.time.start, booking.event.time.end)
        }));

        // Events stats
        const upcomingEvents = await Event.find({ status: "active" }).sort({ date: 1 }).populate('customer');
        // Get next 4 upcoming events
        const events = upcomingEvents.slice(0, 4);
        const cleanedEvents = events.map(event => ({
            id: event.id,
            name: event.customer ? `${event.customer.firstname} ${event.customer.lastname}` : "N/A",
            date: event.date,
            duration: getDuration(event.time.start, event.time.end)
        }));


        // Packages stats
        const packages = await Package.find().sort({ createdAt: -1 });
        // Get last 4 packages
        const recentPackages = packages.slice(0, 4);

        // Reviews stats
        const reviews = await Review.find().sort({ createdAt: -1 });
        // Get last 4 reviews
        const lastReview = reviews[0];

        const dashboardData = {
            bookings: {
                count: activeCount,
                recent: _bookings
            },
            events: {
                count: upcomingEvents.length,
                upcoming: cleanedEvents
            },
            packages: {
                count: packages.length,
                recent: recentPackages
            },
            reviews: {
                count: reviews.length,
                latest: lastReview || null
            }
        }

        return APIResponse.success("Dashboard data retrieved successfully", { dashboard: dashboardData });
    }

)

function getDuration(startTime: string, endTime: string): string {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const start = new Date(0, 0, 0, startHour, startMinute);
    const end = new Date(0, 0, 0, endHour, endMinute);
    const diff = (end.getTime() - start.getTime()) / 1000 / 60; // difference in minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}hrs ${minutes}mins`;
}
