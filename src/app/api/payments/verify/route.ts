import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import APIError from "@/lib/errors/APIError";
import APIResponse from "@/lib/APIResponse";
import Payment from "@/models/Payment";
import { sendNotification } from "@/lib/notification";
import { sendBookingConfirmedEmail } from "@/lib/mailer";
import { subMinutes } from "date-fns";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();

    const { reference } = await request.json();
    if (!reference) throw APIError.BadRequest("Payment reference is required");

    // Verify payment from Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });

    const result = await response.json();
    if (!result.status) throw APIError.BadRequest(result.message || "Verification failed");

    const data = result.data;

    // Ensure transaction was successful
    if (data.status !== "success") {
        throw APIError.BadRequest(`Transaction not successful: ${data.gateway_response}`);
    }

    const paystackRef = data.reference ?? data.id; // prefer reference but fall back to id
    const bookingId = data.metadata?.bookingId;

    // Primary: check by paystack reference
    if (paystackRef) {
        const existingByRef = await Payment.findOne({ reference: paystackRef });
        if (existingByRef) {
            return APIResponse.success("Payment already recorded", { payment: existingByRef }, 200);
        }
    }

    // Secondary: if we have bookingId, check recent payments with same booking+amount
    if (bookingId) {
        const amountNaira = data.amount / 100;
        const recentWindowStart = subMinutes(new Date(), 600); // 10 minute window

        const existingRecent = await Payment.findOne({
            booking: bookingId,
            amount: amountNaira,
            createdAt: { $gte: recentWindowStart },
        });

        if (existingRecent) {
            return APIResponse.success("Payment already recorded (recent)", { payment: existingRecent }, 200);
        }
    }


    // Find booking using metadata reference or provided identifier
    const booking = await Booking.findById(data.metadata?.bookingId);
    if (!booking) throw APIError.NotFound("Booking not found for this payment");

    // Save payment record
    const payment = await Payment.create({
        amount: data.amount / 100, // Convert kobo to naira
        name: `${data.customer.firstName || ""} ${data.customer.lastName || ""}`.trim(),
        email: data.customer.email,
        booking: booking._id,
        reference: paystackRef,
        paystackId: data.id
    });

    // Optionally mark booking as paid
    booking.status = "confirmed";
    await booking.save();

    try {
        await sendBookingConfirmedEmail(payment.email);
        await sendNotification({
            type: "payment",
            title: "New Payment has been made to confirm booking",
            message: "A Customer just completed Booking",
            meta: { payment },
            permission: 2
        })
    } catch (error) {
        throw APIError.Internal(`Error sending email: ${(error as Error).message}`)
    }

    return APIResponse.success("Payment verified and saved successfully", { payment }, 201);
});
