import { IAdmin } from "@/types/Admin";
import { ICustomer } from "@/types/Customer";
import { INotification } from "@/types/Notification";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { format } from "date-fns";
import { IPackage } from "@/types/Package";

function getMailFromAddress(): string {
  const from =
    process.env.MAIL_FROM?.trim() ||
    process.env.MAIL?.trim() ||
    process.env.MAIL_USER?.trim();

  if (!from) {
    throw new Error(
      "Missing sender address. Set MAIL_FROM or MAIL_USER in your environment variables.",
    );
  }

  return from;
}

function getMailFromHeader(): string {
  const name = process.env.MAIL_FROM_NAME?.trim() || "The Yard";
  return `"${name}" <${getMailFromAddress()}>`;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
} as SMTPTransport.Options);

type BookingEmailContext = {
  booking: {
    eventDate: Date;
    guestCount: number;
    totalPrice: number;
  };
  customer: ICustomer;
  pkg: IPackage;
  formattedDate: string;
};

type BookingEmailTemplateOptions = {
  customerName: string;
  headerLabel: string;
  intro: string;
  packageName: string;
  formattedDate: string;
  guestCount: number;
  totalLabel: string;
  totalPrice: number;
  statusLabel: string;
  statusTone: "warning" | "success" | "danger";
  statusText: string;
  closingNote?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value: number): string {
  return `&#8358;${Number(value).toLocaleString()}`;
}

function getStatusStyles(statusTone: BookingEmailTemplateOptions["statusTone"]) {
  if (statusTone === "success") {
    return {
      background: "#e6f4ea",
      color: "#25603b",
    };
  }

  if (statusTone === "danger") {
    return {
      background: "#fbe7e5",
      color: "#9f2d21",
    };
  }

  return {
    background: "#f5e8c8",
    color: "#c68a1d",
  };
}

function buildBookingEmailTemplate({
  customerName,
  headerLabel,
  intro,
  packageName,
  formattedDate,
  guestCount,
  totalLabel,
  totalPrice,
  statusLabel,
  statusTone,
  statusText,
  closingNote,
}: BookingEmailTemplateOptions): string {
  const statusStyles = getStatusStyles(statusTone);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Yard Booking Update</title>
      </head>
      <body style="margin:0;padding:24px;background-color:#f5f2eb;font-family:Georgia, 'Times New Roman', serif;color:#374643;">
        <div style="max-width:640px;margin:0 auto;background-color:#ffffff;border:1px solid #e1d7c8;border-radius:12px;overflow:hidden;">
          <div style="background-color:#133f35;padding:34px 24px 30px;text-align:center;border-bottom:4px solid #d5a74d;">
            <div style="margin:0 0 10px;font-size:18px;line-height:1;color:#ffffff;font-weight:700;letter-spacing:0.02em;">The Yard</div>
            <div style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.4;color:#efbb50;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">${escapeHtml(headerLabel)}</div>
          </div>

          <div style="padding:40px 30px 32px;">
            <p style="margin:0 0 18px;font-family:Arial, Helvetica, sans-serif;font-size:18px;line-height:1.5;font-weight:700;color:#344643;">Hello ${escapeHtml(customerName)},</p>
            <p style="margin:0 0 24px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">${escapeHtml(intro)}</p>

            <div style="margin:0 0 28px;border:1px solid #e6ddd0;border-radius:8px;padding:22px 20px;background-color:#fffdfa;">
              <div style="margin:0 0 14px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;font-weight:700;color:#344643;">Booking Details</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">
                <tr>
                  <td style="padding:6px 0;color:#6b756f;vertical-align:top;">Package:</td>
                  <td style="padding:6px 0;color:#133f35;font-weight:700;">${escapeHtml(packageName)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b756f;vertical-align:top;">Date:</td>
                  <td style="padding:6px 0;color:#133f35;font-weight:700;">${escapeHtml(formattedDate)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b756f;vertical-align:top;">Guests:</td>
                  <td style="padding:6px 0;color:#133f35;font-weight:700;">${guestCount} ${guestCount === 1 ? "Guest" : "Guests"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b756f;vertical-align:top;">${escapeHtml(totalLabel)}</td>
                  <td style="padding:6px 0;color:#133f35;font-weight:700;">${formatCurrency(totalPrice)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 0 0;border-bottom:1px dashed #eadfcd;"></td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0;color:#6b756f;vertical-align:top;">${escapeHtml(statusLabel)}</td>
                  <td style="padding:10px 0 0;">
                    <span style="display:inline-block;padding:5px 10px;border-radius:4px;background-color:${statusStyles.background};color:${statusStyles.color};font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.2;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(statusText)}</span>
                  </td>
                </tr>
              </table>
            </div>

            <div style="margin:0 0 28px;">
              <div style="margin:0 0 14px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;font-weight:700;color:#344643;">Important House Rules</div>
              <ul style="margin:0;padding-left:20px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.8;color:#4d5957;">
                <li><strong>Quiet Hours:</strong> Respectful sound volumes starting at 9:00 PM.</li>
                <li><strong>Waste Disposal:</strong> Please clean up after your event and dispose of all trash in designated bins.</li>
                <li><strong>Catering:</strong> Outside food is welcome, but cleanup must be completed before check-out.</li>
                <li><strong>Smoking:</strong> Strictly prohibited inside covered areas or the wooden deck.</li>
              </ul>
            </div>

            ${closingNote ? `<p style="margin:0 0 28px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">${escapeHtml(closingNote)}</p>` : ""}

            <div style="padding-top:22px;border-top:1px solid #e8dfd2;">
              <p style="margin:0 0 14px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">If you have any questions or require modifications, please contact our team:</p>
              <p style="margin:0 0 10px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">Phone: <strong>+234 901 825 7388</strong></p>
              <p style="margin:0 0 10px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">WhatsApp: <strong>+234 901 825 7388</strong></p>
              <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.7;color:#4d5957;">Email: <strong>complaints@picnicattheyard.com</strong></p>
            </div>
          </div>

          <div style="background-color:#efede4;padding:24px 20px;text-align:center;">
            <p style="margin:0 0 8px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.5;font-weight:700;color:#6d6d63;">The Yard Picnic Park</p>
            <p style="margin:0 0 8px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.6;color:#7a7a70;">21 Umuawulu Street, Independence Layout, Enugu</p>
            <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.6;color:#7a7a70;">Follow us on Instagram <strong>@theyardenugu</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function getBookingEmailContext(bookingId: string): Promise<BookingEmailContext> {
  await connectDB();
  const booking = await Booking.findById(bookingId)
    .populate("customer")
    .populate("package");

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  const customer = booking.customer as unknown as ICustomer;
  const pkg = booking.package as unknown as IPackage;
  const formattedDate = format(new Date(booking.eventDate), "eeee, MMMM do, yyyy");

  return {
    booking: {
      eventDate: booking.eventDate,
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
    },
    customer,
    pkg,
    formattedDate,
  };
}

export async function sendBookingEmail(to: string, bookingId: string) {
  const { booking, customer, pkg, formattedDate } = await getBookingEmailContext(bookingId);

  const html = buildBookingEmailTemplate({
    customerName: customer.firstname,
    headerLabel: "Booking Requested",
    intro:
      "Thank you for choosing The Yard. We have received your booking request and your payment is currently awaiting confirmation from our team.",
    packageName: pkg.name,
    formattedDate,
    guestCount: booking.guestCount,
    totalLabel: "Total Price:",
    totalPrice: booking.totalPrice,
    statusLabel: "Status:",
    statusTone: "warning",
    statusText: "Awaiting Payment Confirmation",
    closingNote:
      "We will review and confirm your payment shortly. Once verified, you will receive a separate booking confirmation email.",
  });

  await transporter.sendMail({
    from: getMailFromHeader(),
    to,
    subject: "Booking requested, awaiting payment confirmation",
    html,
  });
}

export async function sendBookingConfirmedEmail(to: string, bookingId: string) {
  const { booking, customer, pkg, formattedDate } = await getBookingEmailContext(bookingId);

  const html = buildBookingEmailTemplate({
    customerName: customer.firstname,
    headerLabel: "Booking Confirmed",
    intro: "Your booking has been confirmed. We look forward to hosting you at The Yard.",
    packageName: pkg.name,
    formattedDate,
    guestCount: booking.guestCount,
    totalLabel: "Total Paid:",
    totalPrice: booking.totalPrice,
    statusLabel: "Status:",
    statusTone: "success",
    statusText: "Confirmed",
  });

  await transporter.sendMail({
    from: getMailFromHeader(),
    to,
    subject: "Your booking has been confirmed",
    html,
  });
}

export async function sendBookingDeclinedEmail(to: string, bookingId: string) {
  const { booking, customer, pkg, formattedDate } = await getBookingEmailContext(bookingId);

  const html = buildBookingEmailTemplate({
    customerName: customer.firstname,
    headerLabel: "Booking Update",
    intro: "Unfortunately, your booking request could not be approved at this time.",
    packageName: pkg.name,
    formattedDate,
    guestCount: booking.guestCount,
    totalLabel: "Booking Total:",
    totalPrice: booking.totalPrice,
    statusLabel: "Status:",
    statusTone: "danger",
    statusText: "Declined",
    closingNote:
      "Please contact us on +234 901 825 7388 so we can help you choose another available date.",
  });

  await transporter.sendMail({
    from: getMailFromHeader(),
    to,
    subject: "Update on your booking request",
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
    from: getMailFromHeader(),
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
    from: getMailFromHeader(),
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
    from: getMailFromHeader(),
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
    from: getMailFromHeader(),
    to: email,
    subject: "Admin Email Verification Code",
    html,
  });
}
