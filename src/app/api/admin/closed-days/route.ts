import { NextRequest } from "next/server";
import { endOfMonth, endOfDay, format, parse, startOfDay, startOfMonth } from "date-fns";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import ClosedDay from "@/models/ClosedDay";

function parseDateString(value: string): Date {
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  if (Number.isNaN(parsed.getTime())) {
    throw APIError.BadRequest("Invalid date. Use YYYY-MM-DD format.");
  }
  return parsed;
}

export const GET = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

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

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const body = await request.json();
  const dateValue = body?.date;

  if (!dateValue || typeof dateValue !== "string") {
    throw APIError.BadRequest("`date` is required in YYYY-MM-DD format.");
  }

  const parsedDate = parseDateString(dateValue);
  const normalizedDate = startOfDay(parsedDate);

  const existing = await ClosedDay.findOne({
    date: { $gte: startOfDay(normalizedDate), $lte: endOfDay(normalizedDate) },
  });

  if (existing) {
    return APIResponse.success("Day already closed", {
      closedDay: {
        id: existing.id,
        date: format(existing.date, "yyyy-MM-dd"),
        reason: existing.reason || "",
      },
    });
  }

  const closedDay = await ClosedDay.create({
    date: normalizedDate,
    reason: typeof body?.reason === "string" ? body.reason.trim() : "",
    closedBy: payload.id,
  });

  return APIResponse.success("Day closed successfully", {
    closedDay: {
      id: closedDay.id,
      date: format(closedDay.date, "yyyy-MM-dd"),
      reason: closedDay.reason || "",
    },
  });
});

export const DELETE = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    throw APIError.BadRequest("Query param `date` is required in YYYY-MM-DD format.");
  }

  const parsedDate = parseDateString(dateParam);

  await ClosedDay.findOneAndDelete({
    date: { $gte: startOfDay(parsedDate), $lte: endOfDay(parsedDate) },
  });

  return APIResponse.success("Day reopened successfully", {
    date: format(parsedDate, "yyyy-MM-dd"),
  });
});
