import { IAdmin } from "@/types/Admin";
import { ICustomer } from "@/types/Customer";
import { INotification } from "@/types/Notification";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { format } from "date-fns";
import { ISpace } from "@/types/Space";
import { IPackage } from "@/types/Package";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
} as SMTPTransport.Options);

export async function sendBookingEmail(to: string, bookingId: string) {
  await connectDB();
  const booking = await Booking.findById(bookingId)
    .populate("customer")
    .populate("space")
    .populate("package");

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  const customer = booking.customer as unknown as ICustomer;
  const space = booking.space as unknown as ISpace;
  const pkg = booking.package as unknown as IPackage;

  const formattedDate = format(new Date(booking.eventDate), "eeee, MMMM do, yyyy");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Requested - The Yard</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdfbf9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf9; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e9d9c0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #0f3830; padding: 35px 20px; border-bottom: 4px solid #d4a548;">
              <h1 style="color: #fdfbf9; margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal; letter-spacing: 1px;">The Yard</h1>
              <span style="color: #d4a548; font-size: 12px; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; display: block; margin-top: 8px;">Booking Requested</span>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; color: #5a5a53; line-height: 1.6; font-size: 15px;">
              <h2 style="color: #2f433f; margin-top: 0; font-size: 20px;">Hello ${customer.firstname},</h2>
              <p>Thank you for choosing The Yard. We have received your booking request! To finalize your reservation and secure your space, please complete the payment using the instructions below.</p>
              
              <!-- Booking Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf9; border: 1px solid #eeeee6; border-radius: 6px; padding: 20px; margin: 25px 0;">
                <tr>
                  <td style="padding-bottom: 10px; font-weight: bold; color: #2f433f; border-bottom: 1px solid #eeeee6;" colspan="2">Booking Details</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 5px 0; color: #888880; width: 40%;">Space:</td>
                  <td style="padding: 10px 0 5px 0; color: #0f3830; font-weight: bold;">${space.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Package:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${pkg.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Date:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Guests:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${booking.guestCount} Guests</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; 10px 0; color: #888880; border-bottom: 1px dashed #eeeee6;">Total Price:</td>
                  <td style="padding: 5px 0; 10px 0; color: #0f3830; font-weight: bold; border-bottom: 1px dashed #eeeee6; font-size: 16px;">₦${booking.totalPrice.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; color: #888880;">Status:</td>
                  <td style="padding: 10px 0 0 0;"><span style="background-color: #f2e3c6; color: #d4a548; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Pending Payment</span></td>
                </tr>
              </table>
              
              <!-- House Rules -->
              <h3 style="color: #2f433f; font-size: 16px; margin-top: 30px;">🌿 Important House Rules</h3>
              <ul style="padding-left: 20px; margin: 10px 0 25px 0; color: #5a5a53;">
                <li style="margin-bottom: 8px;"><strong>Quiet Hours:</strong> Respectful sound volumes starting at 9:00 PM.</li>
                <li style="margin-bottom: 8px;"><strong>Waste Disposal:</strong> Please clean up after your event and dispose of all trash in designated bins.</li>
                <li style="margin-bottom: 8px;"><strong>Catering:</strong> Outside food is welcome, but cleanup must be completed before check-out.</li>
                <li style="margin-bottom: 8px;"><strong>Smoking:</strong> Strictly prohibited inside covered areas or the wooden deck.</li>
              </ul>
              
              <!-- Support Contact -->
              <p style="margin-top: 30px; border-top: 1px solid #eeeee6; padding-top: 20px;">If you have any questions or require modifications, please contact our team:</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 5px 0;">📞 Phone: <strong>+234 901 825 7388</strong></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">💬 WhatsApp: <strong><a href="https://wa.me/2349018257388" style="color: #0f3830; text-decoration: underline;">+234 901 825 7388</a></strong></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">✉️ Email: <strong>complaints@picnicattheyard.com/</strong></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #eeeee6; padding: 25px; color: #888880; font-size: 12px;">
              <p style="margin: 0 0 8px 0;"><strong>The Yard Picnic Park</strong></p>
              <p style="margin: 0 0 15px 0;">21 Umuawulu Street, Independence Layout, Enugu</p>
              <p style="margin: 0;">Follow us on Instagram <a href="https://instagram.com/theyardenugu" style="color: #2f433f; text-decoration: none; font-weight: bold;">@theyardenugu</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to,
    subject: "Booking submitted, complete payment to confirm",
    html,
  });
}

export async function sendBookingConfirmedEmail(to: string, bookingId: string) {
  await connectDB();
  const booking = await Booking.findById(bookingId)
    .populate("customer")
    .populate("space")
    .populate("package");

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  const customer = booking.customer as unknown as ICustomer;
  const space = booking.space as unknown as ISpace;
  const pkg = booking.package as unknown as IPackage;

  const formattedDate = format(new Date(booking.eventDate), "eeee, MMMM do, yyyy");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - The Yard</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdfbf9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf9; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e9d9c0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #0f3830; padding: 35px 20px; border-bottom: 4px solid #d4a548;">
              <h1 style="color: #fdfbf9; margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal; letter-spacing: 1px;">The Yard</h1>
              <span style="color: #d4a548; font-size: 12px; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; display: block; margin-top: 8px;">Booking Confirmed</span>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; color: #5a5a53; line-height: 1.6; font-size: 15px;">
              <h2 style="color: #2f433f; margin-top: 0; font-size: 20px;">Hello ${customer.firstname},</h2>
              <p>We are delighted to inform you that your payment has been verified, and your booking is officially <strong>confirmed</strong>! We are looking forward to hosting your event at The Yard.</p>
              
              <!-- Booking Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf9; border: 1px solid #eeeee6; border-radius: 6px; padding: 20px; margin: 25px 0;">
                <tr>
                  <td style="padding-bottom: 10px; font-weight: bold; color: #2f433f; border-bottom: 1px solid #eeeee6;" colspan="2">Booking Details</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 5px 0; color: #888880; width: 40%;">Space:</td>
                  <td style="padding: 10px 0 5px 0; color: #0f3830; font-weight: bold;">${space.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Package:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${pkg.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Date:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #888880;">Guests:</td>
                  <td style="padding: 5px 0; color: #0f3830; font-weight: bold;">${booking.guestCount} Guests</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; 10px 0; color: #888880; border-bottom: 1px dashed #eeeee6;">Total Paid:</td>
                  <td style="padding: 5px 0; 10px 0; color: #0f3830; font-weight: bold; border-bottom: 1px dashed #eeeee6; font-size: 16px;">₦${booking.totalPrice.toLocaleString()} (Paid in Full)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; color: #888880;">Status:</td>
                  <td style="padding: 10px 0 0 0;"><span style="background-color: #e4e8e5; color: #0f3830; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Confirmed</span></td>
                </tr>
              </table>
              
              <!-- House Rules -->
              <h3 style="color: #2f433f; font-size: 16px; margin-top: 30px;">🌿 Important House Rules</h3>
              <ul style="padding-left: 20px; margin: 10px 0 25px 0; color: #5a5a53;">
                <li style="margin-bottom: 8px;"><strong>Quiet Hours:</strong> Respectful sound volumes starting at 9:00 PM.</li>
                <li style="margin-bottom: 8px;"><strong>Waste Disposal:</strong> Please clean up after your event and dispose of all trash in designated bins.</li>
                <li style="margin-bottom: 8px;"><strong>Catering:</strong> Outside food is welcome, but cleanup must be completed before check-out.</li>
                <li style="margin-bottom: 8px;"><strong>Smoking:</strong> Strictly prohibited inside covered areas or the wooden deck.</li>
              </ul>
              
              <!-- Support Contact -->
              <p style="margin-top: 30px; border-top: 1px solid #eeeee6; padding-top: 20px;">If you have any questions or require modifications, please contact our team:</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 5px 0;">📞 Phone: <strong>+234 901 825 7388</strong></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">💬 WhatsApp: <strong><a href="https://wa.me/2349018257388" style="color: #0f3830; text-decoration: underline;">+234 901 825 7388</a></strong></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">✉️ Email: <strong>complaints@picnicattheyard.com</strong></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #eeeee6; padding: 25px; color: #888880; font-size: 12px;">
              <p style="margin: 0 0 8px 0;"><strong>The Yard Picnic Park</strong></p>
              <p style="margin: 0 0 15px 0;">21 Umuawulu Street, Independence Layout, Enugu</p>
              <p style="margin: 0;">Follow us on Instagram <a href="https://instagram.com/theyardenugu" style="color: #2f433f; text-decoration: none; font-weight: bold;">@theyardenugu</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to,
    subject: "We have received your payment and confirmed booking",
    html,
  });
}

export async function sendMail(
  to: string,
  message: string,
  subject: string,
  customer: ICustomer,
) {
  const html = `
        <p> <strong> Hello ${customer.firstname} </strong> </p>

        <p> ${message} </p>
    `;
  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to,
    subject,
    html,
  });
}

export async function inviteAdminEmail(admin: IAdmin, password: string) {
  const html = `
        <p> email: ${admin.email} </p>
        <p> password: ${password} </p>
        <p> role: ${admin.role} </p>
    `;
  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to: admin.email,
    subject: "The Yard Admin Invite",
    html,
  });
}

export async function sendNotificationEmail(
  admin: IAdmin,
  data: INotification,
) {
  const html = `
        <p> email: ${admin.email} </p>
        <p> data: ${data} </p>
    `;
  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to: admin.email,
    subject: `${data.message}`,
    html,
  });
}

export async function sendConfirmationEmail(
  email: IAdmin["email"],
  code: string,
) {
  const html = `
        Admin Email Verification Code,
        < p > Your verification code is <b>${code} </b>. It expires in 10 minutes.</p >
    `;
  await transporter.sendMail({
    from: `"The Yard" <${process.env.MAIL}>`,
    to: email,
    subject: `Admin Email Verification Code`,
    html,
  });
}
