"use client";
import FilterCategory from "@/components/v2/FilterCategory";
import HeaderTextComp from "@/components/v2/HeaderTextComp";
import Modal from "@/components/v2/Modal";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { revealItem, sectionReveal, EASE_OUT_EXPO } from "@/lib/v2/animations";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { IGalleryClient } from "@/types/Gallery";
import axios from "axios";
import Loading from "@/components/v2/Loading";

const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

// ── Adaptive bento layout ───────────────────────────────────────────────

type TileSpec = { cols: string; rows: string; minH: string };

type RowTile = { w: 2 | 3 | 4 | 6; tall?: boolean };
type RowPattern = { id: string; tiles: RowTile[]; hero?: boolean };

// Every pattern's widths sum to 6 columns, so each row packs flush — gaps are
// structurally impossible. In "hero" patterns the tall tile spans 2 rows and
// the trailing tiles wrap beneath it via normal grid auto-flow.
const ROW_PATTERNS: RowPattern[] = [
    { id: "3-3", tiles: [{ w: 3 }, { w: 3 }] },
    { id: "4-2", tiles: [{ w: 4 }, { w: 2 }] },
    { id: "2-4", tiles: [{ w: 2 }, { w: 4 }] },
    { id: "2-2-2", tiles: [{ w: 2 }, { w: 2 }, { w: 2 }] },
    { id: "hero-left", tiles: [{ w: 4, tall: true }, { w: 2 }, { w: 2 }], hero: true },
    { id: "hero-right", tiles: [{ w: 2 }, { w: 4, tall: true }, { w: 2 }], hero: true },
    { id: "tall-left", tiles: [{ w: 3, tall: true }, { w: 3 }, { w: 3 }], hero: true },
    { id: "tall-right", tiles: [{ w: 3 }, { w: 3, tall: true }, { w: 3 }], hero: true },
];

const MD_COL: Record<RowTile["w"], string> = {
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
};

function computeTileLayout(count: number): TileSpec[] {
    if (count <= 0) return [];

    // Single image → full-bleed hero
    if (count === 1) {
        return [{ cols: "col-span-6", rows: "md:row-span-2", minH: "min-h-[240px] md:min-h-0" }];
    }

    // Deterministic PRNG seeded by count: stable across renders (no layout
    // shift / hydration mismatch) yet different galleries compose differently.
    let seed = (count * 2654435761) >>> 0;
    const next = () => {
        seed = (seed * 1103515245 + 12345) >>> 0;
        return seed / 4294967296;
    };

    const rows: RowPattern[] = [];
    let remaining = count;
    let lastId = "";
    let lastHero = false;

    if (count === 2) {
        rows.push(ROW_PATTERNS[0]); // two equal halves
        remaining = 0;
    } else if (count === 3) {
        rows.push(ROW_PATTERNS[3]); // three equal thirds
        remaining = 0;
    }

    while (remaining > 0) {
        // Valid = fits, and never strands exactly 1 tile for the next row
        let candidates = ROW_PATTERNS.filter(
            (p) => p.tiles.length <= remaining && remaining - p.tiles.length !== 1
        );
        if (candidates.length === 0) {
            rows.push({ id: "solo", tiles: [{ w: 6 }] }); // wide closer (safety)
            break;
        }

        // Variety: don't repeat a row, don't cluster hero rows
        const varied = candidates.filter((p) => p.id !== lastId && !(p.hero && lastHero));
        if (varied.length > 0) candidates = varied;

        // Open large galleries with a hero row so the composition feels curated
        if (rows.length === 0 && remaining >= 5) {
            const heroes = candidates.filter((p) => p.hero);
            if (heroes.length > 0) candidates = heroes;
        }

        const pick = candidates[Math.floor(next() * candidates.length)];
        rows.push(pick);
        remaining -= pick.tiles.length;
        lastId = pick.id;
        lastHero = !!pick.hero;
    }

    // Mobile flows 2-up; for odd counts promote the first tile to full width
    // so the pairs below always close flush.
    const mobileHeroFirst = count % 2 === 1;
    const specs: TileSpec[] = [];
    for (const row of rows) {
        for (const t of row.tiles) {
            const first = specs.length === 0;
            specs.push({
                cols: `${first && mobileHeroFirst ? "col-span-6" : "col-span-3"} ${MD_COL[t.w]}`,
                rows: t.tall ? "md:row-span-2" : "",
                minH: first && mobileHeroFirst ? "min-h-[200px] md:min-h-0" : "min-h-[145px] md:min-h-0",
            });
        }
    }
    return specs;
}

export function BentoGrid({ images, isMotion }: { images: string[], isMotion?: boolean }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);
    const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set());

    const isImageLoading = activeIndex !== null && !loadedIndexes.has(activeIndex);
    const markImageLoaded = useCallback((index: number) => {
        setLoadedIndexes((prev) => prev.has(index) ? prev : new Set(prev).add(index));
    }, []);

    const showPrev = useCallback(() => {
        setDirection(-1);
        setActiveIndex((current) => current === null ? current : (current - 1 + images.length) % images.length);
    }, [images.length]);

    const showNext = useCallback(() => {
        setDirection(1);
        setActiveIndex((current) => current === null ? current : (current + 1) % images.length);
    }, [images.length]);

    const closeLightbox = useCallback(() => setActiveIndex(null), []);

    const layout = useMemo(() => computeTileLayout(images.length), [images.length]);

    useEffect(() => {
        if (activeIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, closeLightbox, showPrev, showNext]);

    return (
        <>
            <div className="grid grid-cols-6 auto-rows-[minmax(145px,1fr)] gap-3 p-0 md:p-10">
                {images.map((img, i) => {
                    const tile = layout[i];
                    return isMotion ? (
                        <motion.div
                            key={i}
                            className={`relative rounded-lg overflow-hidden cursor-pointer ${tile.cols} ${tile.rows} ${tile.minH}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: 0.05, ease: EASE_OUT_EXPO }}
                            variants={revealItem}
                            onClick={() => setActiveIndex(i)}
                        >
                            <Image
                                src={img}
                                fill
                                alt=""
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    ) : <div
                        key={i}
                        className={`relative rounded-lg overflow-hidden cursor-pointer ${tile.cols} ${tile.rows} ${tile.minH}`}
                        onClick={() => setActiveIndex(i)}
                    >
                        <Image
                            src={img}
                            fill
                            alt=""
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>;
                })}

                <Modal isOpen={activeIndex !== null} handleClose={closeLightbox}>
                    {activeIndex !== null && (
                        <div className="relative w-[90vw] h-[80vh] md:w-[75vw] flex items-center justify-center">
                            <div className="relative w-full h-full overflow-hidden rounded-lg">
                                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                    <motion.div
                                        key={activeIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.7}
                                        onDragEnd={(_, info) => {
                                            if (info.offset.x < -80) showNext();
                                            else if (info.offset.x > 80) showPrev();
                                        }}
                                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                                    >
                                        <Image
                                            src={images[activeIndex]}
                                            fill
                                            alt=""
                                            className="object-contain pointer-events-none"
                                            sizes="90vw"
                                            draggable={false}
                                            onLoad={() => markImageLoaded(activeIndex)}
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {isImageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                                        <motion.div
                                            className="h-10 w-10 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                aria-label="Close"
                                onClick={closeLightbox}
                                className="absolute -top-3 -right-3 md:top-2 md:right-2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        onClick={showPrev}
                                        className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        onClick={showNext}
                                        className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                        <ChevronRight size={22} />
                                    </button>

                                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-sen">
                                        {activeIndex + 1} / {images.length}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </>

    );
}

export default function GalleryPage() {
    const shouldReduceMotion = useReducedMotion();
    const [filters, setFilters] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
    const [gallery, setGallery] = useState<IGalleryClient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const filteredGallery = useMemo(
        () => activeFilter === "All" ? gallery : gallery.filter((item) => item.category === activeFilter),
        [gallery, activeFilter]
    );

    useEffect(() => {
        (async () => {
            try {
                const galleryRes = await axios.get(`/api/gallery`);
                let gallery: IGalleryClient[] = galleryRes.data.data.gallery;
                setGallery(gallery);
                setFilters([
                    "All",
                    ...new Set(gallery.map(item => item.category)),
                ]);
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false);
            }
        })()

    }, [])

    if (loading) return <Loading />

    return (
        <div className='min-h-screen bg-[#F6F2EC] pb-20 md:pb-40'>
            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}>
                <HeaderTextComp pageName="Our Gallery" subtitleText="From intimate dates to joyful celebrations, every setup is thoughtfully curated to create memories that last a life time." titleText="A glimpse of unforgettable" titleStyledText="moments" />
            </motion.div>

            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.55, delay: 0.05, ease: EASE_OUT_EXPO }}>
                <FilterCategory filters={filters.map(item => ({ id: item, label: item }))} activeFilter={activeFilter} handleClick={(id) => {
                    setActiveFilter(id)
                }} />
            </motion.div>

            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_EXPO }} className="relative w-full h-full">

            </motion.div>
            <BentoGrid images={filteredGallery.map((item) => item.imageUrl)} isMotion={true} />



            <motion.div className="flex items-center justify-center gap-4 py-10" initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}>
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
