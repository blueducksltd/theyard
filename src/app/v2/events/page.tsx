"use client";

import FilterCategory from '@/components/v2/FilterCategory';
import Modal from '@/components/v2/Modal';
import { AddMoreFun, formatNaira, type SelectedAddon } from '@/app/v2/packages/page';
import Image from 'next/image';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BadgeCheck, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { IEventClient } from '@/types/Event';
import axios from '@/util/axios';
import Loading from '@/components/v2/Loading';
import EmptyState from '@/components/v2/EmptyState';
import { initiatePayment } from '@/util/payment';

// ── Types ──────────────────────────────────────────────────────────────

const filters = ["All", "Ongoing", "Upcoming", "Passed"] as const;
export type Filter = (typeof filters)[number];

export interface IEvent extends IEventClient {
    selectedAddon: SelectedAddon[];
}

type Step = 'overview' | 'form' | 'summary';

interface FormInputs {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    children: number;
    adults: number;
}

// ── Static Data ────────────────────────────────────────────────────────


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
// Width and padding live only in PANEL_VISIBLE: a hidden panel must occupy
// zero layout space (w-0 h-0 AND no padding), otherwise the border-box
// padding keeps it 40px wide/tall and pushes the visible panel off-center
// inside the modal's centered flex column.
const PANEL_BASE = "bg-white flex flex-col gap-3 transition-all duration-300";
const PANEL_VISIBLE = "p-5 opacity-100 scale-100 w-100 max-w-[calc(100vw-2rem)] md:w-140";
const PANEL_HIDDEN = "opacity-0 scale-0 w-0 h-0 overflow-hidden pointer-events-none";

// Converts a 24-hour "HH:MM" string (e.g. "18:30") to a 12-hour clock ("6:30 PM").
const formatTime = (time: string) => {
    const [hourStr, minuteStr = "00"] = time.split(":");
    const hour = Number(hourStr);
    if (Number.isNaN(hour)) return time;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minuteStr.padStart(2, "0")} ${period}`;
};

// ── EventModalContent ───────────────────────────────────────────────────

interface EventModalContentProps {
    event: IEvent;
    onClose: () => void;
    onConfirmFun: (selectedFun: SelectedAddon[]) => void;
}

const EventModalContent = React.memo(function EventModalContent({ event, onClose, onConfirmFun }: EventModalContentProps) {
    const [step, setStep] = useState<Step>('overview');
    const [showAddFun, setShowAddFun] = useState(false);
    const [inputs, setInputs] = useState<FormInputs>(EMPTY_INPUTS);
    const [loading, setLoading] = useState(false);
    // Stable ref so AddMoreFun (React.memo'd) doesn't re-render on every keystroke.
    const handleHideAddFun = useCallback(() => setShowAddFun(false), []);

    const eventDate = useMemo(() => new Date(event.date), [event.date]);
  
    const packageTotal = useMemo(
        () => (event.adultPrice ?? 0) * inputs.adults + (event.childPrice ?? 0) * inputs.children,
        [event.adultPrice, event.childPrice, inputs.adults, inputs.children]
    );

    const funTotal = useMemo(
        () => event.selectedAddon.reduce((sum, item) => sum + (item.price ?? item.pricePerMin ?? 0) * item.quantity, 0),
        [event.selectedAddon]
    );

    const total = packageTotal + funTotal;

    const summary = useMemo(() => [
        { label: "Package", value: event.title },
        {
            label: "Participants",
            value: `${inputs.adults} ${inputs.adults === 1 ? 'Adult' : 'Adults'}, ${inputs.children} ${inputs.children === 1 ? 'Child' : 'Children'}`,
        },
        { label: "Event Date", value: eventDate.toLocaleDateString("en-US", { dateStyle: "medium" }) },
        { label: "Event Time", value: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}` },
    ], [event.title, inputs.adults, inputs.children, eventDate]);

    const pricingRows = useMemo(() => [
        { label: "Base ticket", value: packageTotal },
        ...event.selectedAddon.map((item) => ({ label: item.name, value: (item.price ?? item.pricePerMin ?? 0) * item.quantity })),
    ], [packageTotal, event.selectedAddon]);

    // step === s AND AddMoreFun is not overlaying
    const isVisible = (s: Step) => step === s && !showAddFun;

    const handleSubmit = () => {
        setLoading(true);
        initiatePayment(
            inputs.email,
            total,
            async () => {
                try {
                    // TODO: POST the event booking to the API once the endpoint is ready.
                    await axios.post(`/events/${event.id}/register`, {
                        name: `${inputs.firstname} ${inputs.lastname}`,
                        phone: inputs.phone,
                        email: inputs.email,
                        adultsComing: inputs.adults ?? null,
                        childrenComing: inputs.children ?? null,
                        addons: event.selectedAddon
                    });
                    toast.success("Event Booked Successfully");

                } catch (err) {
                    toast.error("Event Book Failed, Something went wrong");

                    console.error(err)
                } finally {
                    setLoading(false);
                    onClose();
                }
            },
            () => setLoading(false)
        );
    };

    return (
        <>
            {/* ── STEP 1: Overview ── */}
            <div className={`${PANEL_BASE} ${isVisible('overview') ? `${PANEL_VISIBLE} min-h-100` : PANEL_HIDDEN}`}>
                <div className="h-40 relative shrink-0">
                    <Image
                        src={event.images[0]}
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
                        {
                            event.childPrice && <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                                <b>{formatNaira(event.childPrice!)}</b> Children
                            </span>
                        }
                        {
                            event.adultPrice && <span className="text-xs bg-[#C7CFC9]/50 p-2 text-primaryGreen">
                                <b>{formatNaira(event.adultPrice!)}</b> Adult
                            </span>
                        }
                    </div>
                </div>

                <p className="font-lato text-sm text-[#8C8273] italic">What we&apos;ll do</p>
                <div className="h-30 overflow-auto flex flex-col gap-2 text-[#8C8273] text-sm">
                    {/* Set dedupes an addon whose name also appears in `includes` (duplicate React keys) */}
                    {[...new Set([...(event.includes ?? []), ...event.selectedAddon.map((f) => f.name)])].map((item) => (
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
                closeFun={handleHideAddFun}
                onConfirmAddon={onConfirmFun}
                packageSelectedFun={event.selectedAddon}
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
                                    readOnly={key === "children" && !event.childPrice || key === "adults" && !event.adultPrice}
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
                            if (!inputs.firstname.trim()) return toast("Please enter your first name.", { type: "error" });
                            if (!inputs.lastname.trim()) return toast("Please enter your last name.", { type: "error" });
                            if (!inputs.email.trim()) return toast("Please enter your email address.", { type: "error" });
                            if (!inputs.phone.trim()) return toast("Please enter your phone number.", { type: "error" });
                            if (inputs.adults === 0 && inputs.children === 0) {
                                toast("You must select number for adult ", { type: "error" })
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
                        <p>Total </p>
                        <p>{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <button
                        type="button"
                        className="col-span-2 h-10 bg-primaryGreen text-white font-sen text-sm cursor-pointer flex items-center justify-center"
                        onClick={handleSubmit}
                    >
                        {loading ? <motion.div
                            className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        /> : "Proceed to  pay"}
                    </button>
                </div>
            </div>
        </>
    );
});

// ── Page ───────────────────────────────────────────────────────────────

export default function EventsPage() {
    const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);


    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleOpenModal = useCallback((index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleConfirmFun = useCallback((selectedAddon: SelectedAddon[]) => {
        if (selectedIndex === null) return;
        setEvents((prev) => {
            const next = [...prev];
            next[selectedIndex] = { ...next[selectedIndex], selectedAddon };
            return next;
        });
    }, [selectedIndex]);

    // Pair each event with its original index so the modal/addon handlers
    // keep targeting the right entry even when the list is filtered.
    const filteredEvents = useMemo(() => {
        const indexed = events.map((event, index) => ({ event, index }));
        if (activeFilter === "All") return indexed;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        return indexed.filter(({ event }) => {
            const date = new Date(event.date);
            if (activeFilter === "Ongoing") return date >= startOfToday && date < endOfToday;
            if (activeFilter === "Upcoming") return date >= endOfToday;
            return date < startOfToday; // Passed
        });
    }, [activeFilter, events]);

    const selectedEvent = selectedIndex !== null ? events[selectedIndex] : null;
    useEffect(() => {
        let cancelled = false;
        document.body.style.overflow = "hidden"; // Disable scrolling while loading
        (async () => {
            try {
                const req = await axios.get("../api/events");
                if (cancelled) return;
                const resEvents: IEvent[] = req.data.data.events
                setEvents(resEvents.map(item => ({ ...item, selectedAddon: [] })))
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) {
                    document.body.style.overflow = ""; // Re-enable scrolling
                    setIsLoading(false);
                }
            }
        })()
        return () => {
            cancelled = true;
            document.body.style.overflow = "";
        };
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="pt-10 pb-20 md:pb-40">
            <Modal isOpen={modalOpen} handleClose={handleCloseModal}>
                {selectedEvent && (
                    // key forces a fresh mount (and state reset) when a different event is opened
                    <EventModalContent
                        key={selectedEvent.slug}
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
                {filteredEvents.length === 0 && (
                    <EmptyState
                        title="No Events"
                        message="There are no events at the moment. Please check back soon for upcoming celebrations."
                    />
                )}
                {filteredEvents.map(({ event, index }) => {
                    return (
                        <div
                            key={event.slug}
                            className="p-3 grid gap-2 font-inter cursor-pointer"
                            onClick={() => handleOpenModal(index)}
                        >
                            <div className="h-50 relative">
                                <Image
                                    src={event.images[0]}
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
