"use client";

import HeaderTextComp from "@/components/v2/HeaderTextComp";
import Modal from "@/components/v2/Modal";
import { useBookingStore } from "@/store/bookingStore";
import { BadgeCheck, Check, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────

export interface Package {
    image: string;
    name: string;
    price: number;
    includes: string[];
    maxPersons: number;
}

interface FunItem {
    image: string;
    title: string;
    price: number;
    category: "Decoration" | "Food" | "Games";
}

export interface SelectedFun extends FunItem {
    quantity: number;
}

export interface PackageWithFun extends Package {
    selectedFun: SelectedFun[];
}

// ── Static Data ────────────────────────────────────────────────────────

export const PACKAGES: Package[] = [
    {
        image: "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg",
        name: "Romantic Date Night",
        price: 45000,
        includes: [
            "Private candlelit table setup",
            "Rose petals & fairy lights",
            "3-course gourmet dinner",
            "Complimentary wine bottle",
            "Professional photography (30 mins)",
            "Personalized love note",
        ],
        maxPersons: 10
    },
    {
        image: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg",
        name: "Birthday Celebration",
        price: 80000,
        includes: [
            "Themed balloon & backdrop decor",
            "Custom birthday cake",
            "Buffet setup for 10 guests",
            "DJ & sound system",
            "Photo booth with props",
            "Party favors for guests",
        ],
        maxPersons: 20
    },
    {
        image: "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg",
        name: "Marriage Proposal",
        price: 20000,
        includes: [
            "Exclusive venue reservation",
            "Luxury floral arch arrangement",
            "Live musician or string quartet",
            "Champagne toast for two",
            "Videography coverage",
            "Dinner reservation post-proposal",
        ],
        maxPersons: 13
    },
    {
        image: "https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg",
        name: "Garden Picnic",
        price: 35000,
        includes: [
            "Styled picnic blanket & cushions",
            "Gourmet picnic basket for two",
            "Fresh fruit platter",
            "Sparkling juice & mocktails",
            "Bluetooth speaker",
            "Board games & playing cards",
        ],
        maxPersons: 11
    },
    {
        image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
        name: "Private Dining Experience",
        price: 150000,
        includes: [
            "Exclusive restaurant buyout",
            "Personal chef & waiter",
            "5-course tasting menu",
            "Premium wine pairing",
            "Custom table settings",
            "Valet parking for guests",
        ],
        maxPersons: 10
    },
    {
        image: "https://images.pexels.com/photos/226737/pexels-photo-226737.jpeg",
        name: "Anniversary Deluxe",
        price: 95000,
        includes: [
            "Luxury hotel suite decoration",
            "Red rose pathway",
            "Couples massage voucher",
            "7-course private dinner",
            "Overnight stay package",
            "Breakfast in bed service",
        ],
        maxPersons: 1
    },
];

const FUN_DATA: FunItem[] = [
    { image: "/images/balloons.jpg", title: "Party Balloons", price: 15, category: "Decoration" },
    { image: "/images/banner.jpg", title: "Birthday Banner", price: 20, category: "Decoration" },
    { image: "/images/flowers.jpg", title: "Flower Bouquet", price: 35, category: "Decoration" },
    { image: "/images/lights.jpg", title: "Fairy Lights", price: 25, category: "Decoration" },
    { image: "/images/pizza.jpg", title: "Pizza", price: 50, category: "Food" },
    { image: "/images/burger.jpg", title: "Burger", price: 30, category: "Food" },
    { image: "/images/cupcakes.jpg", title: "Cupcakes", price: 18, category: "Food" },
    { image: "/images/drinks.jpg", title: "Soft Drinks", price: 12, category: "Food" },
    { image: "/images/board-game.jpg", title: "Board Game", price: 40, category: "Games" },
    { image: "/images/karaoke.jpg", title: "Karaoke", price: 60, category: "Games" },
    { image: "/images/darts.jpg", title: "Dart Board", price: 28, category: "Games" },
    { image: "/images/vr.jpg", title: "VR Experience", price: 120, category: "Games" },
];

const TABS: FunItem["category"][] = ["Decoration", "Food", "Games"];
const QUANTITY_CATEGORIES = new Set<FunItem["category"]>(["Food", "Games"]);

// ── Helpers ────────────────────────────────────────────────────────────

export function formatNaira(value: number): string {
    return value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}

// ── Sub-Components ─────────────────────────────────────────────────────

interface ModalContentProps {
    selectedPackage: PackageWithFun;
    onClose: () => void;
    onConfirmFun: (selectedFun: SelectedFun[]) => void;
}

export const ModalContent = React.memo(function ModalContent({
    selectedPackage,
    onClose,
    onConfirmFun,
}: ModalContentProps) {
    const [showAddFun, setShowAddFun] = useState(false);

    const totalSelectedFun = useMemo(() => {
        return selectedPackage.selectedFun.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }, [selectedPackage.selectedFun]);

    const totalPrice = selectedPackage.price + totalSelectedFun;
    const { setSelectedPackage } = useBookingStore();
    const router = useRouter() 
    return (
        <>
            <div
                className={`bg-white p-5 space-y-3 transition-all duration-300 ${!showAddFun
                    ? "opacity-100 scale-100 w-100 md:w-120 min-h-100"
                    : "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none"
                    }`}
            >
                <div className="h-40 relative">
                    <Image
                        src={selectedPackage.image}
                        fill
                        alt={selectedPackage.name}
                        className="object-cover object-center rounded"
                        sizes="50vw"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-6 h-6 absolute top-2 right-2 bg-white flex items-center justify-center cursor-pointer rounded-full shadow"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 font-playfair">
                    <h1 className="font-bold text-primaryGreen">{selectedPackage.name}</h1>
                    <div className="gap-3 flex items-center">
                        <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                         <b>{formatNaira(totalPrice)}</b> /Person
                    </span>
                   <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                       {selectedPackage.maxPersons} {selectedPackage.maxPersons > 1 ? "Persons"  : "Person"}  <b>Max</b> 
                    </span>
                    </div>
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">Includes</p>
                <div className="grid gap-2 my-5 text-[#8C8273] h-30 overflow-auto text-sm">
                    {selectedPackage.includes
                        .concat(selectedPackage.selectedFun.map((item) => item.title))
                        .map((include) => (
                            <div key={include} className="flex items-center gap-2">
                                <BadgeCheck size={14} />
                                <p className="font-lato">{include}</p>
                            </div>
                        ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 font-sen text-xs">
                    <button
                        type="button"
                        className="p-2 bg-secondaryGreen text-primaryGreen cursor-pointer"
                        onClick={() => setShowAddFun(true)}
                    >
                        Add more fun
                    </button>
                    <button
                        type="button"
                        className="p-2 bg-primaryGreen text-white cursor-pointer"
                        onClick={() => {
                            setSelectedPackage(selectedPackage);
                            router.push("/v2/booking")
                        }}
                    >
                        Book this package
                    </button>
                </div>
            </div>

            <AddMoreFun
                show={showAddFun}
                onClose={() => setShowAddFun(false)}
                onConfirmFun={onConfirmFun}
                packageSelectedFun={selectedPackage.selectedFun}
            />
        </>
    );
});

// ── AddMoreFun ─────────────────────────────────────────────────────────

interface AddMoreFunProps {
    show: boolean;
    onClose: () => void;
    onConfirmFun: (selectedFun: SelectedFun[]) => void;
    packageSelectedFun: SelectedFun[];
}

export const AddMoreFun = React.memo(function AddMoreFun({
    show,
    onClose,
    onConfirmFun,
    packageSelectedFun,
}: AddMoreFunProps) {
    const [selectedTab, setSelectedTab] = useState<FunItem["category"]>(TABS[0]);
    const [selections, setSelections] = useState<Map<string, number>>(() => {
        const map = new Map<string, number>();
        for (const item of packageSelectedFun) {
            map.set(item.title, item.quantity);
        }
        return map;
    });

    // prevShowRef is always false so that a false→true transition is detected
    // whether this component mounts fresh (Modal case) or stays mounted (inline case)
    const prevShowRef = useRef(false);

    // Re-sync selections from parent whenever the panel opens
    useEffect(() => {
        if (show && !prevShowRef.current) {
            const map = new Map<string, number>();
            for (const item of packageSelectedFun) {
                map.set(item.title, item.quantity);
            }
            setSelections(map);
            setSelectedTab(TABS[0]);
        }
        prevShowRef.current = show;
    }, [show, packageSelectedFun]);

    const filteredData = useMemo(
        () => FUN_DATA.filter((item) => item.category === selectedTab),
        [selectedTab]
    );

    const isQuantityBased = useCallback(
        (category: FunItem["category"]) => QUANTITY_CATEGORIES.has(category),
        []
    );

    const isSelected = useCallback(
        (title: string) => (selections.get(title) ?? 0) > 0,
        [selections]
    );

    const getQuantity = useCallback(
        (title: string) => selections.get(title) ?? 0,
        [selections]
    );

    const handleToggleDecoration = useCallback((item: FunItem) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.title);
            if (current && current > 0) {
                next.delete(item.title);
            } else {
                next.set(item.title, 1);
            }
            return next;
        });
    }, []);

    const handleIncrement = useCallback((item: FunItem) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.title) ?? 0;
            next.set(item.title, current + 1);
            return next;
        });
    }, []);

    const handleDecrement = useCallback((item: FunItem) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.title) ?? 0;
            if (current <= 1) {
                next.delete(item.title);
            } else {
                next.set(item.title, current - 1);
            }
            return next;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        const selected: SelectedFun[] = [];
        for (const item of FUN_DATA) {
            const qty = selections.get(item.title) ?? 0;
            if (qty > 0) {
                selected.push({ ...item, quantity: qty });
            }
        }
        onConfirmFun(selected);
        onClose();
    }, [selections, onConfirmFun, onClose]);

    return (
        <div
            className={`bg-white p-5 space-y-3 transition-all duration-300 ${show
                ? "opacity-100 scale-100 w-100 md:w-120 min-h-100"
                : "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none"
                }`}
        >
            <div className="flex items-center justify-between">
                <h1 className="font-playfair text-primaryGreen font-medium text-xl">
                    The Yard Extra Experience
                </h1>
                <button
                    type="button"
                    aria-label="Close"
                    className="h-9 w-9 flex items-center justify-center cursor-pointer shadow-[0px_4px_13.7px_0px_rgba(0,0,0,0.1)]"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-lightBrown p-1 h-10">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        className={`flex items-center justify-center text-sm font-sen cursor-pointer ${tab === selectedTab
                            ? "bg-primaryBrown text-lightBrown"
                            : "bg-white/30 text-primaryGreen"
                            }`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="h-60 overflow-auto space-y-5 scrollbar-hide">
                {filteredData.map((item) => {
                    const quantityBased = isQuantityBased(item.category);
                    const selected = isSelected(item.title);
                    const quantity = getQuantity(item.title);

                    return (
                        <div
                            key={item.title}
                            className="flex cursor-pointer gap-3.5 p-3.5 bg-white border border-neutral-200 max-w-140"
                            onClick={() =>  handleToggleDecoration(item)}
                        >
                            <div
                                className={`shrink-0 w-5.5 h-5.5 rounded-full flex items-center justify-center ${selected ? "bg-primaryGreen text-white" : "outline text-primaryGreen"
                                    }`}
                            >
                                <Check size={13} aria-hidden />
                            </div>

                            <div className="flex items-center w-full gap-5">
                                <div className="shrink-0 w-18 h-18 overflow-hidden relative">
                                    <Image
                                        src="https://images.pexels.com/photos/4989348/pexels-photo-4989348.jpeg"
                                        alt={item.title}
                                        fill
                                        className="object-cover object-center"
                                        sizes="72px"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-medium font-playfair text-primaryGreen truncate m-0">
                                        {item.title}
                                    </p>
                                    <p className="text-[13px] text-neutral-400 m-0 font-lato">
                                        Beautiful balloon setup
                                    </p>
                                    {quantityBased && (
                                        <p className="text-sm font-bold text-primaryGreen whitespace-nowrap m-0">
                                            {formatNaira(item.price)}
                                        </p>
                                    )}
                                </div>

                                <div className="shrink-0 flex items-center">
                                    {quantityBased ? (
                                        <div
                                            className="flex items-center justify-between gap-3 py-1 px-3 bg-black/5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                type="button"
                                                aria-label="Decrease quantity"
                                                className="flex flex-1 items-center justify-center h-full cursor-pointer"
                                                onClick={() => handleDecrement(item)}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <p className="shrink-0 w-6 text-center m-0 text-sm">{quantity}</p>
                                            <button
                                                type="button"
                                                aria-label="Increase quantity"
                                                className="flex flex-1 items-center justify-center h-full cursor-pointer"
                                                onClick={() => handleIncrement(item)}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-bold text-primaryGreen whitespace-nowrap m-0">
                                            {formatNaira(item.price)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={handleConfirm}
                className="p-2 bg-primaryGreen text-[#EEEEE6] w-full font-sen text-sm"
            >
                Confirm
            </button>
        </div>
    );
});

// ── Package Card ───────────────────────────────────────────────────────

interface PackageCardProps {
    pkg: PackageWithFun;
    index: number;
    onSelect: (index: number) => void;
}

export const PackageCard = React.memo(function PackageCard({
    pkg,
    index,
    onSelect,
}: PackageCardProps) {
    const pathname = usePathname()
    const isBooking = pathname.includes('booking');
    const shouldReduceMotion = useReducedMotion();

    const cardReveal = {
        hidden: { opacity: 0, y: 16  },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            onClick={() => onSelect(index)}
            className="cursor-pointer"
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
            variants={cardReveal}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="bg-white p-3 rounded border border-primaryBrown">
                <div className="h-50 relative">
                    <Image
                        src={pkg.image}
                        fill
                        alt={pkg.name}
                        className="object-cover object-center rounded"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                <div className="flex items-center justify-between py-4 font-playfair flex-wrap gap-4">
                    <h1 className="font-bold text-primaryGreen">{pkg.name}</h1>
                    {
                        isBooking ? <div className="w-full flex items-center gap-3 font-lato">
                             <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                                <b className="font-playfair-display text-sm">{formatNaira(pkg.maxPersons)}</b>/Person
                            </span>
                            <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                                {pkg.maxPersons} {pkg.maxPersons === 1 ? "Person" : "Persons"} <b className="font-playfair-displa text-smy">Max</b>
                            </span>
                           
                        </div> : <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                            Starting at <b className="font-playfair-display">{formatNaira(pkg.price)}</b>
                        </span>
                    }
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">Includes</p>
                <div className="grid gap-2 my-5 text-[#8C8273]">
                    {pkg.includes.map((include) => (
                        <div key={include} className="flex items-center gap-2">
                            <BadgeCheck size={14} />
                            <p className="font-lato text-sm">{include}</p>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 text-primaryGreen">
                        <BadgeCheck size={14} />
                        <p className="font-lato text-sm">Learn more...</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

// ── Page ───────────────────────────────────────────────────────────────

export default function PackagesPage() {
    // Each package now carries its own selectedFun
    const [packagesWithFun, setPackagesWithFun] = useState<PackageWithFun[]>(() =>
        PACKAGES.map((p) => ({ ...p, selectedFun: [] }))
    );

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const selectedPackage =
        selectedIndex !== null ? packagesWithFun[selectedIndex] : null;

    const handleShowPackage = useCallback((index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // Saves selectedFun back to the SPECIFIC package that is currently open
    const handleSelectFun = useCallback(
        (selectedFun: SelectedFun[]) => {
            if (selectedIndex === null) return;
            setPackagesWithFun((prev) => {
                const next = [...prev];
                next[selectedIndex] = { ...next[selectedIndex], selectedFun };
                return next;
            });
        },
        [selectedIndex]
    );

    return (
        <div className="pb-20 md:pb-40">
            <Modal handleClose={handleCloseModal} isOpen={modalOpen}>
                {selectedPackage && (
                    <ModalContent
                        selectedPackage={selectedPackage}
                        onClose={handleCloseModal}
                        onConfirmFun={handleSelectFun}
                    />
                )}
            </Modal>

            <HeaderTextComp
                pageName="Our Package"
                subtitleText="Whether you're planning a romantic picnic for two, a birthday with friends, or a stylish intimate wedding, The Yard offers curated packages tailored to your needs."
                titleStyledText="For you"
                titleText="A careful template"
            />

            <div className="p-5 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                {packagesWithFun.map((pkg, index) => (
                    <PackageCard
                        key={pkg.name}
                        pkg={pkg}
                        index={index}
                        onSelect={handleShowPackage}
                    />
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 py-10 px-5 md:px-10">
                <div className="w-[60%] md:w-[20%] flex items-center flex-col justify-center gap-4">
                    <h1 className="text-primaryGreen font-medium text-2xl font-playfair text-center capitalize">
                        Customize your{" "}
                        <span className="font-petit text-primaryBrown">Experience</span>
                    </h1>
                    <Link
                        href="/"
                        className="bg-primaryGreen py-3 px-6 text-white text-sm font-sen w-full text-center"
                    >
                        Book your experience
                    </Link>
                </div>
            </div>
        </div>
    );
}