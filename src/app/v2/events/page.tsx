"use client";

import FilterCategory from '@/components/v2/FilterCategory';
import Modal from '@/components/v2/Modal';
import { AddMoreFun, type SelectedFun } from '@/app/v2/packages/page';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { BadgeCheck, X } from 'lucide-react';
import { toast } from 'react-toastify';

// ── Types ──────────────────────────────────────────────────────────────

const filters = ["All", "Ongoing", "Upcoming", "Passed"] as const;
export type Filter = (typeof filters)[number];

type EventPrice = { children: number; adult: number };

type Event = {
    image: string;
    title: string;
    description: string;
    date: string;
    filter: Filter;
    price: EventPrice;
    includes: string[];
};

type EventWithFun = Event & { selectedFun: SelectedFun[] };

type Step = 'overview' | 'form' | 'summary';

interface FormInputs {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    children: number;
    adults: number;
}

// ── Helpers ────────────────────────────────────────────────────────────

function formatNaira(value: number): string {
    return value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}

// ── Static Data ────────────────────────────────────────────────────────

const EVENTS: Event[] = [
    {
        image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg",
        title: "Tech Innovators Summit 2026",
        description: "A gathering of developers, founders, and tech enthusiasts.",
        date: "2026-07-15",
        filter: "Upcoming",
        price: { children: 1000, adult: 1500 },
        includes: [
            "Reserved seating",
            "Welcome drinks",
            "Networking session",
            "Speaker sessions access",
            "Event goodie bag",
        ],
    },
    {
        image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg",
        title: "Summer Coding Bootcamp",
        description: "An intensive workshop covering React, Next.js, and TypeScript.",
        date: "2026-06-28",
        filter: "Ongoing",
        price: { children: 1000, adult: 1500 },
        includes: [
            "Full workshop access",
            "Hands-on project materials",
            "Lunch & refreshments",
            "Certificate of completion",
            "Mentorship session",
        ],
    },
    {
        image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg",
        title: "Startup Pitch Night",
        description: "Early-stage startups present their ideas to investors.",
        date: "2026-05-20",
        filter: "Passed",
        price: { children: 1000, adult: 1500 },
        includes: [
            "Pitch slot (5 mins)",
            "Investor panel feedback",
            "Networking cocktail hour",
            "Presentation coaching",
            "Event recording access",
        ],
    },
];

const EMPTY_INPUTS: FormInputs = {
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    children: 0,
    adults: 0,
};

const FORM_FIELDS: Array<{
    key: keyof FormInputs;
    label: string;
    placeholder: string;
    type: 'text' | 'tel' | 'email' | 'number';
}> = [
        { key: 'firstname', label: 'First name', placeholder: 'First name', type: 'text' },
        { key: 'lastname', label: 'Last name', placeholder: 'Last name', type: 'text' },
        { key: 'phone', label: 'Phone number (WhatsApp)', placeholder: '+234 800 000 0000', type: 'tel' },
        { key: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email' },
        { key: 'children', label: 'Children (Aged 1–14)', placeholder: 'Number of children', type: 'number' },
        { key: 'adults', label: 'Adults (Aged 15–80)', placeholder: 'Number of adults', type: 'number' },
    ];

// ── Panel transition helpers ────────────────────────────────────────────
// Width lives only in PANEL_VISIBLE so it doesn't conflict with w-0 in PANEL_HIDDEN.
const PANEL_BASE = "bg-white p-5 flex flex-col gap-3 transition-all duration-300";
const PANEL_VISIBLE = "opacity-100 scale-100 w-100 md:w-140";
const PANEL_HIDDEN = "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none";

// ── EventModalContent ───────────────────────────────────────────────────

interface EventModalContentProps {
    event: EventWithFun;
    onClose: () => void;
    onConfirmFun: (selectedFun: SelectedFun[]) => void;
}

function EventModalContent({ event, onClose, onConfirmFun }: EventModalContentProps) {
    const [step, setStep] = useState<Step>('overview');
    const [showAddFun, setShowAddFun] = useState(false);
    const [inputs, setInputs] = useState<FormInputs>(EMPTY_INPUTS);

    // Stable ref so AddMoreFun (React.memo'd) doesn't re-render on every keystroke.
    const handleHideAddFun = useCallback(() => setShowAddFun(false), []);

    const eventDate = useMemo(() => new Date(event.date), [event.date]);

    const packageTotal = useMemo(
        () => event.price.adult * inputs.adults + event.price.children * inputs.children,
        [event.price, inputs.adults, inputs.children]
    );

    const funTotal = useMemo(
        () => event.selectedFun.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [event.selectedFun]
    );

    const total = packageTotal + funTotal;

    const summary = useMemo(() => [
        { label: "Package", value: event.title },
        {
            label: "Participants",
            value: `${inputs.adults} ${inputs.adults === 1 ? 'Adult' : 'Adults'}, ${inputs.children} ${inputs.children === 1 ? 'Child' : 'Children'}`,
        },
        { label: "Event Date", value: eventDate.toLocaleDateString("en-US", { dateStyle: "medium" }) },
        { label: "Event Time", value: eventDate.toLocaleTimeString("en-US", { timeStyle: "short", hour12: true }) },
    ], [event.title, inputs.adults, inputs.children, eventDate]);

    const pricingRows = useMemo(() => [
        { label: "Base ticket", value: packageTotal },
        ...event.selectedFun.map((item) => ({ label: item.title, value: item.price * item.quantity })),
    ], [packageTotal, event.selectedFun]);

    // step === s AND AddMoreFun is not overlaying
    const isVisible = (s: Step) => step === s && !showAddFun;

    return (
        <>
            {/* ── STEP 1: Overview ── */}
            <div className={`${PANEL_BASE} ${isVisible('overview') ? `${PANEL_VISIBLE} min-h-100` : PANEL_HIDDEN}`}>
                <div className="h-40 relative shrink-0">
                    <Image
                        src={event.image}
                        fill
                        alt={event.title}
                        className="object-cover object-center rounded"
                        sizes="(max-width: 768px) 100vw, 560px"
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

                <div className="flex flex-wrap flex-col md:flex-row md:items-center md:justify-between gap-3 py-2 font-playfair">
                    <h1 className="font-bold text-primaryGreen">{event.title}</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                            <b>{formatNaira(event.price.children)}</b> Children
                        </span>
                        <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                            <b>{formatNaira(event.price.adult)}</b> Adult
                        </span>
                    </div>
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">What we'll do</p>
                <div className="h-30 overflow-auto flex flex-col gap-2 text-[#8C8273] text-sm">
                    {[...event.includes, ...event.selectedFun.map((f) => f.title)].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                            <BadgeCheck size={14} />
                            <p className="font-lato">{item}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 font-sen text-xs">
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
                        onClick={() => setStep('form')}
                    >
                        Join this event
                    </button>
                </div>
            </div>

            {/* ── ADD MORE FUN overlay — sibling, not absolute-positioned ── */}
            <AddMoreFun
                show={showAddFun}
                onClose={handleHideAddFun}
                onConfirmFun={onConfirmFun}
                packageSelectedFun={event.selectedFun}
            />

            {/* ── STEP 2: Registration Form ── */}
            <div className={`${PANEL_BASE} ${isVisible('form') ? `${PANEL_VISIBLE} h-[80vh] overflow-auto` : PANEL_HIDDEN}`}>
                <div className="flex items-center justify-between shrink-0">
                    <h1 className="font-playfair-display text-primaryGreen font-medium text-xl">
                        {event.title}
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center cursor-pointer shadow"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3 font-lato text-black/70 text-sm font-medium shrink-0">
                    <p>{eventDate.toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                    <p>{eventDate.toLocaleTimeString("en-US", { timeStyle: "short", hour12: true })}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-lato text-xs">
                    {FORM_FIELDS.map(({ key, label, placeholder, type }) => (
                        <div key={key} className="grid gap-2">
                            <label htmlFor={`event-${key}`} className="text-[#1A1A1A]">{label}</label>
                            <div className="h-10 p-2 border border-[#999999] flex items-center">
                                <input
                                    id={`event-${key}`}
                                    type={type}
                                    name={key}
                                    placeholder={placeholder}
                                    className="w-full outline-none text-sm bg-transparent"
                                    min={type === 'number' ? 0 : undefined}
                                    value={inputs[key] === 0 ? "" : inputs[key]}
                                    onChange={(e) =>
                                        setInputs((prev) => ({
                                            ...prev,
                                            [key]: type === 'number'
                                                ? Math.max(0, Number(e.target.value))
                                                : e.target.value,
                                        } as FormInputs))
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 flex flex-col items-center gap-1 bg-[#C7CFC9]/50 shrink-0">
                    <p className="text-[#1A1A1A] text-xs font-lato">Total Cost</p>
                    <p className="font-playfair-display font-bold text-lg text-primaryGreen">
                        {formatNaira(total)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sen text-xs shrink-0">
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
                            if (inputs.adults === 0 && inputs.children === 0) {
                                toast("You must select number for adult ", {type: "error"})
                                return;
                            }

                            setStep('summary')
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* ── STEP 3: Booking Summary ── */}
            <div className={`${PANEL_BASE} ${isVisible('summary') ? `${PANEL_VISIBLE} h-[80vh] overflow-auto` : PANEL_HIDDEN}`}>
                <div className="bg-[#E4E8E5] text-primaryGreen -mx-5 -mt-5 px-5 py-4 flex justify-between items-center shrink-0">
                    <h1 className="text-sm capitalize font-playfair-display">Booking Summary</h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm font-lato">
                    {summary.map((item) => (
                        <React.Fragment key={item.label}>
                            <p className="text-[#717068]">{item.label}</p>
                            <p className="text-primaryGreen text-right">{item.value}</p>
                        </React.Fragment>
                    ))}
                </div>

                <div className="border-t border-gray-100 shrink-0" />

                <div className="grid grid-cols-2 gap-y-3 text-sm font-lato pb-6">
                    <p className="font-playfair font-bold text-lg text-primaryGreen">Pricing</p>
                    <p className="font-playfair font-bold text-lg text-primaryGreen text-right">₦</p>

                    {pricingRows.map((row) => (
                        <React.Fragment key={row.label}>
                            <p className="text-[#717068]">{row.label}</p>
                            <p className="text-primaryGreen text-right font-bold">
                                {row.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </React.Fragment>
                    ))}

                    <div className="col-span-2 border-t border-gray-200 mt-2 pt-3 flex justify-between font-semibold text-primaryGreen text-sm">
                        <p>Total</p>
                        <p>{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <button
                        type="button"
                        className="col-span-2 h-10 bg-primaryGreen text-white font-sen text-sm"
                    >
                        Proceed to pay
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function EventsPage() {
    const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [eventsWithFun, setEventsWithFun] = useState<EventWithFun[]>(() =>
        EVENTS.map((event) => ({ ...event, selectedFun: [] }))
    );

    const handleOpenModal = useCallback((index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleConfirmFun = useCallback((selectedFun: SelectedFun[]) => {
        if (selectedIndex === null) return;
        setEventsWithFun((prev) => {
            const next = [...prev];
            next[selectedIndex] = { ...next[selectedIndex], selectedFun };
            return next;
        });
    }, [selectedIndex]);

    const filteredEvents = useMemo(
        () => EVENTS.filter((item) => item.filter === activeFilter || activeFilter === "All"),
        [activeFilter]
    );

    const selectedEvent = selectedIndex !== null ? eventsWithFun[selectedIndex] : null;

    return (
        <div className="pt-10 pb-20 md:pb-40">
            <Modal isOpen={modalOpen} handleClose={handleCloseModal}>
                {selectedEvent && (
                    // key forces a fresh mount (and state reset) when a different event is opened
                    <EventModalContent
                        key={selectedIndex}
                        event={selectedEvent}
                        onClose={handleCloseModal}
                        onConfirmFun={handleConfirmFun}
                    />
                )}
            </Modal>

            <div className="flex flex-col justify-center items-center gap-6 px-5 pt-30 pb-10 md:py-20">
                <p className="font-lato text-primaryGreen">Our Events</p>
                <div className="w-full md:w-[40%] grid gap-4">
                    <h1 className="text-primaryGreen text-4xl font-playfair-display text-center">
                        We{" "}
                        <span className="font-petit text-primaryBrown">Celebrate</span>{" "}
                        special day
                    </h1>
                    <p className="font-inter text-center text-sm">
                        Step into our world of serene beauty and vibrant celebrations. Browse our
                        favorite moments and get inspired for your own Yard experience.
                    </p>
                </div>
            </div>

            <FilterCategory
                filters={filters.map((item) => ({ id: item, label: item }))}
                activeFilter={activeFilter}
                handleClick={(id) => setActiveFilter(id as Filter)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 px-5 py-10 md:p-20">
                {filteredEvents.map((event) => {
                    const originalIndex = EVENTS.indexOf(event);
                    return (
                        <div
                            key={event.title}
                            className="p-3 grid gap-2 font-inter cursor-pointer"
                            onClick={() => handleOpenModal(originalIndex)}
                        >
                            <div className="h-50 relative">
                                <Image
                                    src={event.image}
                                    fill
                                    alt={event.title}
                                    className="object-cover"
                                />
                            </div>
                            <div className="grid gap-1">
                                <p className="font-semibold text-lg font-playfair-display text-primaryGreen">
                                    {event.title}
                                </p>
                                <p className="font-lato text-[#4B6450] text-sm font-light">
                                    {event.description}
                                </p>
                                <p className="font-lato text-primaryGreen text-sm mt-6 font-medium">
                                    {new Date(event.date).toLocaleDateString("en-us", { dateStyle: "medium" })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
