import { NextRequest, NextResponse } from "next/server";
import { SignUpEventDTO } from "@/types/Event";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import SignUp from "@/models/SignUp";

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  try {
    await connectDB();

    const eventId = params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const validatedData = SignUpEventDTO.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, errors: validatedData.error.flatten() },
        { status: 400 },
      );
    }

    const { name, phone, email, adultTickets, childTickets } = validatedData.data;

    // Validate tickets based on audienceType
    if (event.audienceType === "adults" && (childTickets && childTickets > 0)) {
      return NextResponse.json(
        { success: false, message: "This is an adults-only event. Child tickets are not allowed." },
        { status: 400 },
      );
    }

    if (event.audienceType === "children" && (adultTickets && adultTickets > 0)) {
      return NextResponse.json(
        { success: false, message: "This is a children-only event. Adult tickets are not allowed." },
        { status: 400 },
      );
    }

    if (event.audienceType === "adults" && (!adultTickets || adultTickets === 0)) {
      return NextResponse.json(
        { success: false, message: "Please specify the number of adult tickets for this event." },
        { status: 400 },
      );
    }

    if (event.audienceType === "children" && (!childTickets || childTickets === 0)) {
      return NextResponse.json(
        { success: false, message: "Please specify the number of child tickets for this event." },
        { status: 400 },
      );
    }

    if (event.audienceType === "both" && (!adultTickets && !childTickets)) {
      return NextResponse.json(
        { success: false, message: "Please specify the number of adult or child tickets for this event." },
        { status: 400 },
      );
    }

    const newSignUp = await SignUp.create({
      eventId,
      name,
      phone,
      email,
      adultTickets,
      childTickets,
    });

    return NextResponse.json(
      { success: true, data: newSignUp },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error signing up for event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
