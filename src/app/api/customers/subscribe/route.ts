import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sendNotification } from "@/lib/notification";
import Customer from "@/models/Customer";
import { SubscribeDTO, SubscribeInput } from "@/types/Customer";
import { NextRequest } from "next/server";

export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();
        const body: SubscribeInput = await request.json();
        const data = SubscribeDTO.parse(body);

        const subscriber = await Customer.subscribe(data.email);

        await sendNotification({
            type: "subscription",
            title: "New Subscription",
            message: `${subscriber.email} just subscribed to newsletter`,
            permission: 3,
            meta: { customer: subscriber }
        })

        return APIResponse.success("Subscribed successfully", { subscriber: subscriber.email }, 201);
    }
)