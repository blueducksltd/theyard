import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Customer from "@/models/Customer";
import { NextRequest } from "next/server";
import { sendMail } from "@/lib/mailer";
import { ICustomer, SendEmailDto, SendEmailInput } from "@/types/Customer";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const body: SendEmailInput = await request.json();
    const data = SendEmailDto.parse(body);

    let recipients: ICustomer[];

    // ✅ If specific customers are provided, fetch their emails
    if (Array.isArray(data.customers) && data.customers.length > 0) {
        const customers = await Customer.find({ _id: { $in: data.customers } });
        recipients = customers;
    } else {
        // ✅ Otherwise send to all customers
        const customers = await Customer.find();
        recipients = customers;
    }

    // ✅ Send email concurrently
    await Promise.all(
        recipients.map(customer => sendMail(customer.email, data.message, data.subject, customer))
    );

    return Response.json({
        message: `Email sent to ${recipients.length} customer(s)`
    });
});

