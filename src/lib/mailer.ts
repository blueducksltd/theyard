import { IAdmin } from "@/types/Admin";
import { ICustomer } from "@/types/Customer";
import { INotification } from "@/types/Notification";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
// import { render } from "@react-email/render";
// import BookingConfirmationEmail from "@/emails/BookingConfirmation";


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
} as SMTPTransport.Options);

export async function sendBookingEmail(to: string) {
    // const html = render(<BookingConfirmationEmail name={ name } bookingId = { bookingId } />);
    const html = `<p> Booking successful </B>`;
    await transporter.sendMail({
        from: `"The Yard" <${process.env.MAIL}>`,
        to,
        subject: "Booking Confirmed",
        html,
    });
};

export async function sendMail(to: string, message: string, subject: string, customer: ICustomer) {
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
    `
    await transporter.sendMail({
        from: `"The Yard" <${process.env.MAIL}>`,
        to: admin.email,
        subject: "The Yard Admin Invite",
        html,
    });
}

export async function sendNotificationEmail(admin: IAdmin, data: INotification) {
    const html = `
        <p> email: ${admin.email} </p>
        <p> data: ${data} </p>
    `
    await transporter.sendMail({
        from: `"The Yard" <${process.env.MAIL}>`,
        to: admin.email,
        subject: `${data.message}`,
        html,
    });
}

export async function sendConfirmationEmail(email: IAdmin["email"], code: string) {
    const html = `
        Admin Email Verification Code,
        < p > Your verification code is <b>${code} </b>. It expires in 10 minutes.</p >
    `
    await transporter.sendMail({
        from: `"The Yard" <${process.env.MAIL}>`,
        to: email,
        subject: `Admin Email Verification Code`,
        html,
    });
}