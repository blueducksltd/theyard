import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sendNotification } from "@/lib/notification";
import Customer from "@/models/Customer";
import Inquiry from "@/models/Inquiry";
import { CreateInquiryDTO, CreateInquiryInput, sanitizeInquiry } from "@/types/Inquiry";
import { NextRequest } from "next/server";


// submit an inquiry form
export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();

    const body: CreateInquiryInput = await request.json();
    const data = CreateInquiryDTO.parse(body);

    const customer = await Customer.findOneAndUpdate(
        { email: data.email },
        {
            $set: {
                firstname: data.firstName,
                lastname: data.lastName,
                phone: data.phone,
            },
        },
        { new: true, upsert: true }
    );

    if (!customer) throw new Error("Failed to create or update customer");

    const inquiry = await Inquiry.create({
        customer: customer._id,
        message: data.message,
    });

    if (!inquiry) throw new Error("Failed to create inquiry");

    await sendNotification({
        type: "inquiry",
        title: "New Inquiry",
        message: `Received a new inquiry from ${customer.firstname}`,
        permission: 3,
        meta: { inquiry }
    });

    // ✅ populate inquiry with customer details
    await inquiry.populate("customer");

    return APIResponse.success(
        "Inquiry submitted successfully",
        { inquiry: sanitizeInquiry(inquiry) },
        201
    );
});

