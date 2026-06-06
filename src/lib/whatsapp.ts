import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { format } from "date-fns";
import { ICustomer } from "@/types/Customer";
import { ISpace } from "@/types/Space";
import { IPackage } from "@/types/Package";

export async function sendBookingWhatsApp(bookingId: string) {
  try {
    await connectDB();
    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("space")
      .populate("package");

    if (!booking) {
      console.warn(`[WhatsApp] Booking ${bookingId} not found.`);
      return;
    }

    const customer = booking.customer as unknown as ICustomer;
    const space = booking.space as unknown as ISpace;
    const pkg = booking.package as unknown as IPackage;

    const formattedDate = format(new Date(booking.eventDate), "eeee, MMMM do, yyyy");

    const message = `🌿 *The Yard Enugu - Booking Request Received* 🌿\n\n` +
      `Hello *${customer.firstname} ${customer.lastname}*,\n\n` +
      `We have received your booking request! To finalize your reservation, please proceed with the payment.\n\n` +
      `*Booking Details:*\n` +
      `• *Space:* ${space.name}\n` +
      `• *Package:* ${pkg.name}\n` +
      `• *Date:* ${formattedDate}\n` +
      `• *Guests:* ${booking.guestCount}\n` +
      `• *Total Price:* ₦${booking.totalPrice.toLocaleString()}\n` +
      `• *Status:* Pending Payment\n\n` +
      `*Important House Rules:*\n` +
      `1. Quiet hours start at 9:00 PM.\n` +
      `2. Dispose of all trash in designated bins.\n` +
      `3. Outside catering is welcome.\n` +
      `4. No smoking inside canopy/covered areas.\n\n` +
      `*For Enquiries:*\n` +
      `📞 Call/WhatsApp: +234 901 825 7388\n` +
      `✉️ Email: complaints@picnicattheyard.com\n\n` +
      `We look forward to hosting you!`;

    console.log(`\n========================================\n[WhatsApp SMS Sandbox] Sending to ${customer.phone || customer.email} (Pending Notification):\n\n${message}\n========================================\n`);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}

export async function sendBookingConfirmedWhatsApp(bookingId: string) {
  try {
    await connectDB();
    const booking = await Booking.findById(bookingId)
      .populate("customer")
      .populate("space")
      .populate("package");

    if (!booking) {
      console.warn(`[WhatsApp] Booking ${bookingId} not found.`);
      return;
    }

    const customer = booking.customer as unknown as ICustomer;
    const space = booking.space as unknown as ISpace;
    const pkg = booking.package as unknown as IPackage;

    const formattedDate = format(new Date(booking.eventDate), "eeee, MMMM do, yyyy");

    const message = `🌿 *The Yard Enugu - Booking Confirmed!* 🌿\n\n` +
      `Hello *${customer.firstname} ${customer.lastname}*,\n\n` +
      `Your payment has been verified, and your booking is officially *Confirmed*! We are excited to host your event.\n\n` +
      `*Booking Details:*\n` +
      `• *Space:* ${space.name}\n` +
      `• *Package:* ${pkg.name}\n` +
      `• *Date:* ${formattedDate}\n` +
      `• *Guests:* ${booking.guestCount}\n` +
      `• *Total Paid:* ₦${booking.totalPrice.toLocaleString()} (Paid in Full)\n` +
      `• *Status:* Confirmed\n\n` +
      `*Important House Rules:*\n` +
      `1. Quiet hours start at 9:00 PM.\n` +
      `2. Dispose of all trash in designated bins.\n` +
      `3. Outside catering is welcome.\n` +
      `4. No smoking inside canopy/covered areas.\n\n` +
      `*For Enquiries:*\n` +
      `📞 Call/WhatsApp: +234 901 825 7388\n` +
      `✉️ Email: complaints@picnicattheyard.com\n\n` +
      `We look forward to hosting you!`;

    console.log(`\n========================================\n[WhatsApp SMS Sandbox] Sending to ${customer.phone || customer.email} (Confirmed Notification):\n\n${message}\n========================================\n`);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}
