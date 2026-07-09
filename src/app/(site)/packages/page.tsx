"use client";

import HeaderTextComp from "@/components/v2/HeaderTextComp";
import Modal from "@/components/v2/Modal";
import { useBookingStore } from "@/store/bookingStore";
import { BadgeCheck, Check, Minus, PackageX, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IPackageClient } from "@/types/Package";
import axios from "@/util/axios";
import Loading from "@/components/v2/Loading";
import EmptyState from "@/components/v2/EmptyState";
import { AddOnCategory, IAddOnModelClient } from "@/types/AddOn";

// ── Types ──────────────────────────────────────────────────────────────

export interface Package {
    id: string;
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
    category: AddOnCategory;
}

export interface SelectedFun extends FunItem {
    quantity: number;
}

export interface PackageWithFun extends Package {
    selectedFun: SelectedAddon[];
}

export interface IPackageFun extends IPackageClient {
    selectedAddon: SelectedAddon[];
}

export interface SelectedAddon extends IAddOnModelClient {
    quantity: number;
}




const TABS: FunItem["category"][] = ["decoration", "food", "game"];
const QUANTITY_CATEGORIES = new Set<FunItem["category"]>(["food", "game"]);

// ── Helpers ────────────────────────────────────────────────────────────

export function formatNaira(value: number): string {
    return value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}

// ── Sub-Components ─────────────────────────────────────────────────────

interface ModalContentProps {
    selectedPackage: IPackageFun;
    onClose: () => void;
    onConfirmAddon: (selectedAddon: SelectedAddon[]) => void;
}

export const ModalContent = React.memo(function ModalContent({
    selectedPackage,
    onClose,
    onConfirmAddon,
}: ModalContentProps) {
    const [showAddFun, setShowAddFun] = useState(false);

    // Stable ref so AddMoreFun (React.memo'd) doesn't re-render on every parent render.
    const handleHideAddFun = useCallback(() => setShowAddFun(false), []);

    const totalSelectedAddons = useMemo(() => {
        return selectedPackage.selectedAddon.reduce(
            (sum, item) => sum + (item.price ?? item.pricePerMin ?? 0) * item.quantity,
            0
        );
    }, [selectedPackage.selectedAddon]);

    const totalPrice = selectedPackage.price + totalSelectedAddons;
    const { setSelectedPackage } = useBookingStore();
    const router = useRouter();
    return (
        <>
            {/* Padding lives in the visible branch only: a hidden panel with p-5 still
                occupies a 40px border-box and pushes the modal content off-center. */}
            <div
                className={`bg-white space-y-3 transition-all duration-300 ${!showAddFun
                    ? "p-5 opacity-100 scale-100 w-100 max-w-[calc(100vw-2rem)] md:w-120 min-h-100"
                    : "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none"
                    }`}
            >
                <div className="h-40 relative">
                    <Image
                        src={selectedPackage.imageUrl}
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
                        <span className="text-xs  p-2 bg-lightBrown text-black">
                            {selectedPackage.guestLimit} {selectedPackage.guestLimit > 1 ? "slots" : "slot"}  <b>left</b>
                        </span>
                    </div>
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">Includes</p>
                <div className="grid gap-2 my-5 text-[#8C8273] h-30 overflow-auto text-sm">
                    {/* Set dedupes an addon whose name also appears in specs (duplicate React keys) */}
                    {[...new Set(selectedPackage.specs
                        .concat(selectedPackage.selectedAddon.map((item) => item.name)))]
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
                            router.push("/booking")
                        }}
                    >
                        Book this package
                    </button>
                </div>
            </div>

            <AddMoreFun
                show={showAddFun}
                closeFun={handleHideAddFun}
                onConfirmAddon={onConfirmAddon}
                packageSelectedFun={selectedPackage.selectedAddon}
            />
        </>
    );
});

// ── AddMoreFun ─────────────────────────────────────────────────────────

interface AddMoreFunProps {
    show: boolean;
    onConfirmAddon: (selectedAddon: SelectedAddon[]) => void;
    closeFun: () => void;
    packageSelectedFun: SelectedAddon[];
}

// Module-level cache: AddMoreFun remounts every time a modal opens, and without
// this each mount refired the same GET /api/admin/addons request.
let addonsCache: IAddOnModelClient[] | null = null;

export const AddMoreFun = React.memo(function AddMoreFun({
    show,
    onConfirmAddon,
    closeFun,
    packageSelectedFun,
}: AddMoreFunProps) {
    const [selectedTab, setSelectedTab] = useState<FunItem["category"]>(TABS[0]);
    const [addons, setAddons] = useState<IAddOnModelClient[]>(() => addonsCache ?? []);
    const [selections, setSelections] = useState<Map<string, number>>(() => {
        const map = new Map<string, number>();
        for (const item of packageSelectedFun) {
            map.set(item.name, item.quantity);
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
                map.set(item.name, item.quantity);
            }
            setSelections(map);
            setSelectedTab(TABS[0]);
        }
        prevShowRef.current = show;
    }, [show, packageSelectedFun]);

    const filteredData = useMemo(
        () => addons.filter((item) => item.category === selectedTab),
        [selectedTab, addons]
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

    const handleToggleDecoration = useCallback((item: IAddOnModelClient) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.name) ?? 0;
            if (current && current > 0) {
                next.delete(item.name);
            } else {
                next.set(item.name, 1);
            }
            return next;
        });
    }, []);

    const handleIncrement = useCallback((item: IAddOnModelClient) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.name) ?? 0;
            next.set(item.name, current + 1);
            return next;
        });
    }, []);

    const handleDecrement = useCallback((item: IAddOnModelClient) => {
        setSelections((prev) => {
            const next = new Map(prev);
            const current = next.get(item.name) ?? 0;
            if (current <= 1) {
                next.delete(item.name);
            } else {
                next.set(item.name, current - 1);
            }
            return next;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        const selected: SelectedAddon[] = [];
        for (const item of addons) {
            const qty = selections.get(item.name) ?? 0;
            if (qty > 0) {
                selected.push({ ...item, quantity: qty, id: item.id });
            }
        }
        onConfirmAddon(selected);
        closeFun();
    }, [addons, selections, onConfirmAddon, closeFun]);

    useEffect(() => {
        if (addonsCache) return; // already seeded from cache in useState
        let cancelled = false;
        (async () => {
            try {
                const res = await axios.get("../api/admin/addons");
                addonsCache = res.data.data.addOns;
                if (!cancelled) setAddons(res.data.data.addOns);
            } catch (err) {
                console.error("Error fetching add-ons:", err);
            }
        })()
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div
            className={`bg-white space-y-3 transition-all duration-300 flex flex-col justify-between ${show
                ? "p-5 opacity-100 scale-100 w-100 max-w-[calc(100vw-2rem)] md:w-140 min-h-120"
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
                    onClick={closeFun}
                >
                    <X size={18} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-lightBrown p-1 h-10">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        className={`flex items-center justify-center text-sm font-sen cursor-pointer capitalize ${tab === selectedTab
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
                    const selected = isSelected(item.name);
                    const quantity = getQuantity(item.name);
                    const displayPrice = item.price ?? item.pricePerMin ?? 0;

                    return (
                        <div
                            key={item.name}
                            className={`flex cursor-pointer gap-3.5 p-3.5 bg-white border ${selected ? "border-primaryGreen" : "border-neutral-200"} max-w-140`}
                            onClick={() => handleToggleDecoration(item)}
                        >
                            <div
                                className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${selected ? "bg-primaryGreen text-white" : "outline text-primaryGreen"
                                    }`}
                            >

                                {selected ? <Check size={13} aria-hidden /> : null}
                                {/* <Check size={13} aria-hidden /> */}
                            </div>

                            <div className="flex items-center w-full gap-5">
                                <div className="shrink-0 w-18 h-18 overflow-hidden relative">
                                    <Image
                                        src="https://images.pexels.com/photos/4989348/pexels-photo-4989348.jpeg"
                                        alt={item.name}
                                        fill
                                        className="object-cover object-center"
                                        sizes="72px"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-medium font-playfair text-primaryGreen truncate m-0">
                                        {item.name}
                                    </p>
                                    <p className="text-[13px] text-neutral-400 m-0 font-lato">
                                        Beautiful balloon setup
                                    </p>
                                    {quantityBased && (
                                        <p className="text-sm font-bold text-primaryGreen whitespace-nowrap m-0">
                                            {formatNaira(displayPrice)}
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
                                            {formatNaira(displayPrice)}
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
    pkg: IPackageFun;
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
        hidden: { opacity: 0, y: 16 },
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
                        src={pkg.imageUrl}
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
                                <b className="font-playfair-display text-sm">{formatNaira(pkg.price)}</b>/Person
                            </span>
                            <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                                {pkg.guestLimit} {pkg.guestLimit === 1 ? "Person" : "Persons"} <b className="font-playfair-display text-sm">Max</b>
                            </span>

                        </div> : <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                            Starting at <b className="font-playfair-display">{formatNaira(pkg.price)}</b>
                        </span>
                    }
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">Includes</p>

                <div className="grid gap-2 my-5 text-[#8C8273] h-20 overflow-auto">
                    {pkg.specs.map((spec) => (
                        <div className="flex items-start gap-1 mb-1" key={spec}>
                            <BadgeCheck size={14} className="shrink-0 mt-0.5" />
                            <p className="font-lato text-sm line-clamp-2">{spec}</p>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 text-primaryGreen h-6">
                        <BadgeCheck size={14} className="shrink-0" />
                        <p className="font-lato text-sm truncate">Learn more...</p>
                    </div>
                </div>


            </div>

        </motion.div>
    );
});

// ── Page ───────────────────────────────────────────────────────────────

export default function PackagesPage() {
    const [packages, setPackages] = useState<IPackageFun[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const selectedPackage =
        selectedIndex !== null ? packages[selectedIndex] : null;

    const handleShowPackage = useCallback((index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // Saves selectedFun back to the SPECIFIC package that is currently open
    const handleSelectAddon = useCallback(
        (selectedAddon: SelectedAddon[]) => {
            if (selectedIndex === null) return;
            setPackages((prev) => {
                const next = [...prev];
                next[selectedIndex] = { ...next[selectedIndex], selectedAddon };
                return next;
            });
        },
        [selectedIndex]
    );

    useEffect(() => {
        let cancelled = false;
        document.body.style.overflow = "hidden"; // Disable scrolling while loading
        (async () => {
            try {
                const packagesRes = await axios.get(`../api/packages`);
                if (cancelled) return;
                setPackages(packagesRes.data.data.packages.map((p: IPackageClient) => ({ ...p, selectedAddon: [] })));
            } catch (err) {
                console.error("Error fetching packages:", err);
            } finally {
                if (!cancelled) {
                    document.body.style.overflow = ""; // Re-enable scrolling
                    setLoading(false);
                }
            }
        })()
        return () => {
            cancelled = true;
            document.body.style.overflow = "";
        };
    }, []);


    if (loading) {
        return <Loading />
    }
    return (
        <div className="pb-20 md:pb-40">
            <Modal handleClose={handleCloseModal} isOpen={modalOpen}>
                {selectedPackage && (
                    <ModalContent
                        selectedPackage={selectedPackage}
                        onClose={handleCloseModal}
                        onConfirmAddon={handleSelectAddon}
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
                {packages.length === 0 && (
                    <EmptyState
                        icon={PackageX}
                        title="No Packages"
                        message="There are no packages available at the moment. Please check back soon."
                    />
                )}
                {packages.map((pkg, index) => (
                    <PackageCard
                        key={pkg.id}
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