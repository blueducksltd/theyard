"use client";
import FilterCategory from "@/components/v2/FilterCategory";
import HeaderTextComp from "@/components/v2/HeaderTextComp";
import { Inter, Lato, Petit_Formal_Script, Playfair_Display, Sen } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";import { motion, useReducedMotion } from 'motion/react';

function BentoGrid({ images }: { images: string[] }) {
    return (
        <div className="grid grid-cols-6 auto-rows-[minmax(145px,1fr)] gap-3 p-5 md:p-10">
            {images.map((img, i) => {
                const tile = TILE_PATTERN[i % TILE_PATTERN.length];
                return (
                    <div
                        key={i}
                        className={`relative rounded-lg overflow-hidden ${tile.cols} ${tile.rows} ${tile.minH}`}
                    >
                        <Image src={img} fill alt={""} className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                );
            })}
        </div>
    );
}

const filters = ["All", "Date Night", "Birthdays", "Proposals", "Picnics", "Private Dining"];
const TILE_PATTERN = [
    // 2×2 hero (spans 2 cols, 2 rows)
    { cols: 'col-span-6 md:col-span-2', rows: 'md:row-span-2', minH: 'min-h-[200px] md:min-h-0' },
    // four 1×1 small tiles
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    // two more 1×1
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    { cols: 'col-span-3 md:col-span-1', rows: '', minH: 'min-h-[145px] md:min-h-0' },
    // 2×1 wide tile
    { cols: 'col-span-6 md:col-span-2', rows: '', minH: 'min-h-[145px] md:min-h-0' },
];


const gallery: { image: string; category: (typeof filters)[number] }[] = [{
    image: "https://images.pexels.com/photos/34230681/pexels-photo-34230681.jpeg",
    category: "Date Night",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Birthdays",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Birthdays",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Birthdays",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Proposals",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Picnics",

},
{
    image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
    category: "Private Dining",

}
]
export default function GalleryPage() {
    const shouldReduceMotion = useReducedMotion();
    const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
    const sectionReveal = {
        hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };
    const itemReveal = {
        hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };

    return (
        <div className='min-h-screen bg-[#F6F2EC] pb-20 pb-40'>
            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <HeaderTextComp pageName="Our Gallery" subtitleText="From intimate dates to joyful celebrations, every setup is thoughtfully curated to create memories that last a life time." titleText="A glimpse of unforgettable" titleStyledText="moments" />
            </motion.div>

            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
                <FilterCategory filters={filters.map(item => ({ id: item, label: item }))} activeFilter={activeFilter} handleClick={(id) => {
                    setActiveFilter(id)
                }} />
            </motion.div>

            {/* <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory px-5 flex items-center justify-center">
                <div className="flex gap-2 md:gap-10  w-max ">
                    {filters.map(item => (
                        <button
                            onClick={() => setActiveFilter(item)}
                            key={item}
                            className={`min-w-20 border py-2 px-5 flex items-center justify-center ${Inter_Font.className} text-sm rounded-full ${activeFilter === item ? "bg-primaryGreen text-white" : "text-primaryGreen border-primaryGreen"} cursor-pointer`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div> */}

            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
                <BentoGrid
                    images={gallery
                        .filter(
                            (item) =>
                                activeFilter.toLowerCase() === "all" ||
                                activeFilter === item.category
                        )
                        .map((item) => item.image)}
                />
            </motion.div>

            <motion.div className="flex items-center justify-center gap-4 py-10" initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="w-full md:w-[50%] flex items-center flex-col justify-center gap-4">
                    <h1 className={`text-primaryGreen font-medium text-4xl font-playfair-display text-center capitalize`}>
                        Join TheYard {" "} <br />
                        <span className={`font-petit text-primaryBrown text-2xl`}>
                            Experience
                        </span>
                    </h1>

                    <Link href={"/"} className={`bg-primaryGreen py-3 px-6 text-white text-sm font-sen`}>
                        Join our upcoming event
                    </Link>
                </div>


            </motion.div>

        </div>
    )
}
