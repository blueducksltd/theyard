
// ---------------------
// Helpers
// ---------------------
export function generateTimeSlots(startHour = 8, endHour = 20) {
    const slots: string[] = [];
    for (let h = startHour; h <= endHour; h++) {
        slots.push(`${String(h).padStart(2, "0")}:00`);
    }
    return slots;
}

export function toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}
