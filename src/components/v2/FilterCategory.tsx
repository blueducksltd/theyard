import React, { useState } from 'react'

export default function FilterCategory({ filters, handleClick, activeFilter }: { filters: { label: string; id: string }[], handleClick: (id: string) => void; activeFilter: string }) {
    // const [activeFilter, setActiveFilter] = useState<string>('')
    return (
        <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory px-5 flex items-center justify-center">
            <div className="flex gap-2 md:gap-10  w-max ">
                {filters.map(item => (
                    <button
                        onClick={() => {
                            // setActiveFilter(item.id)
                            handleClick(item.id)
                        }}
                        key={item.id}
                        className={`min-w-20 border py-2 px-5 flex items-center justify-center font-inter text-sm rounded-full ${activeFilter === item.id ? "bg-primaryGreen text-white" : "text-primaryGreen border-primaryGreen"} cursor-pointer`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
