import { NextRequest } from "next/server";
import { endOfMonth, format, parse, startOfMonth } from "date-fns";
import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import ClosedDay from "@/models/ClosedDay";
import APIError from "@/lib/errors/APIError";

export const GET = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  const filter: Record<string, unknown> = {};

  if (month) {
    const parsedMonth = parse(month, "yyyy-MM", new Date());
    if (Number.isNaN(parsedMonth.getTime())) {
      throw APIError.BadRequest("Invalid month. Use YYYY-MM format.");
    }

    filter.date = {
      $gte: startOfMonth(parsedMonth),
      $lte: endOfMonth(parsedMonth),
    };
  }

  const closedDays = await ClosedDay.find(filter).sort({ date: 1 });

  return APIResponse.success("Closed days fetched", {
    closedDays: closedDays.map((item) => ({
      id: item.id,
      date: format(item.date, "yyyy-MM-dd"),
      reason: item.reason || "",
    })),
  });
});
