
// ---------------------
// Helpers
// ---------------------

export function generateSlots(start: string, end: string): string[] {
    const slots: string[] = [];
    const [startH] = start.split(":").map(Number);
    const [endH] = end.split(":").map(Number);

    for (let h = startH; h <= endH; h++) {
        slots.push(`${String(h).padStart(2, "0")}:00`);
    }

    return slots;
}

export function toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}
