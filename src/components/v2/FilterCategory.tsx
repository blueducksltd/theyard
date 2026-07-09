import React from 'react'

export default function FilterCategory({ filters, handleClick, activeFilter }: { filters: { label: string; id: string }[], handleClick: (id: string) => void; activeFilter: string }) {
    // const [activeFilter, setActiveFilter] = useState<string>('')
    return (
        <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory ">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 w-max mx-auto">
                {filters.map(item => (
                    <button
                        onClick={() => handleClick(item.id)}
                        key={item.id}
                        className={`capitalize snap-start shrink-0 whitespace-nowrap min-w-24 sm:min-w-28 md:min-w-30 border py-1.5 px-4 sm:py-2 sm:px-5 flex items-center justify-center font-inter text-xs sm:text-sm rounded-full transition-colors cursor-pointer ${activeFilter === item.id
                            ? "bg-primaryGreen text-white border-primaryGreen"
                            : "text-primaryGreen border-primaryGreen"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
