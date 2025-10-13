// src/app/api/payments/webhook/route.ts
import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { sendNotification } from "@/lib/notification";
import { sendBookingConfirmedEmail } from "@/lib/mailer";
import { subMinutes } from "date-fns";

export const POST = async (req: NextRequest) => {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const signature = req.headers.get("x-paystack-signature") || "";

    // Get raw body for signature validation
    const rawBody = await req.text();

    const computedSig = crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

    if (computedSig !== signature) {
        return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
        return new Response("Ignored event", { status: 200 });
    }

    await connectDB();

    const data = event.data;
    const bookingId = data.metadata?.bookingId;
    if (!bookingId) {
        return new Response("Missing bookingId in metadata", { status: 400 });
    }

    // Ensure we don’t duplicate payment
    const paystackRef = data.reference ?? data.id;
    const amountNaira = data.amount / 100;

    const recentWindowStart = subMinutes(new Date(), 600);

    const existing = await Payment.findOne({
        $or: [
            { reference: paystackRef },
            {
                booking: bookingId,
                amount: amountNaira,
                createdAt: { $gte: recentWindowStart },
            },
        ],
    });

    if (existing) return new Response("Payment already recorded", { status: 200 });

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return new Response("Booking not found", { status: 404 });

    // Save payment
    const payment = await Payment.create({
        amount: amountNaira,
        name: `${data.customer.first_name || ""} ${data.customer.last_name || ""}`.trim(),
        email: data.customer.email,
        booking: booking._id,
        reference: paystackRef,
        paystackId: data.id,
    });

    // Mark booking confirmed
    booking.status = "confirmed";
    await booking.save();

    // Notify & email
    try {
        await sendBookingConfirmedEmail(payment.email);
        await sendNotification({
            type: "payment",
            title: "New Payment Confirmed",
            message: `Booking confirmed for ${payment.name}`,
            meta: { payment },
            permission: 2,
        });
    } catch (err) {
        console.error("Notification/Email Error:", err);
    }

    return new Response("Payment verified successfully", { status: 200 });
};
