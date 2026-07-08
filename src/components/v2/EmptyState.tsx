import React from 'react'
import { CalendarX, LucideIcon } from 'lucide-react'

export default function EmptyState({
    title = "Nothing here yet",
    message,
    icon: Icon = CalendarX,
}: {
    title?: string;
    message?: string;
    icon?: LucideIcon;
}) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 px-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#C7CFC9]/50 flex items-center justify-center text-primaryGreen">
                <Icon size={26} />
            </div>
            <h2 className="font-playfair-display text-primaryGreen text-xl font-medium">
                {title}
            </h2>
            {message && (
                <p className="font-lato text-sm text-[#8C8273] max-w-xs">
                    {message}
                </p>
            )}
        </div>
    )
}
