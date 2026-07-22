"use client";

import FilterCategory from '@/components/v2/FilterCategory';
import Modal from '@/components/v2/Modal';
import { AddMoreFun, formatNaira, type SelectedAddon } from '@/app/(site)/packages/page';
import Image from 'next/image';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, Share2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { IEventClient } from '@/types/Event';
import axios from '@/util/axios';
import Loading from '@/components/v2/Loading';
import EmptyState from '@/components/v2/EmptyState';
import { initiatePayment } from '@/util/payment';
import ShareModal from '@/components/v2/ShareModal';
import { useRouter, usePathname } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────

const filters = ["All", "Ongoing", "Upcoming", "Passed"] as const;
export type Filter = (typeof filters)[number];

export interface IEvent extends IEventClient {
    selectedAddon: SelectedAddon[];
}

interface EventsApiResponse {
    success: boolean;
    message: string;
    data: {
        events: IEventClient[];
    };
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

// Parses date-only strings (e.g. "2026-07-14") as local time, not UTC, to
// avoid off-by-one-day errors across timezones. Pure/no captures, so it lives
// at module scope instead of being recreated on every filteredEvents recompute.
const parseLocalDate = (value: string | Date) => {
    if (value instanceof Date) return value;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
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
    const coverImage = event.images?.find((img) => typeof img === "string" && img.trim().length > 0) ?? null;

    const summary = useMemo(() => [
        { label: "Package", value: event.title },
        {
            label: "Participants",
            value: `${inputs.adults} ${inputs.adults === 1 ? 'Adult' : 'Adults'}, ${inputs.children} ${inputs.children === 1 ? 'Child' : 'Children'}`,
        },
        { label: "Event Date", value: eventDate.toLocaleDateString("en-US", { dateStyle: "medium" }) },
        { label: "Event Time", value: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}` },
    ], [event.title, event.startTime, event.endTime, inputs.adults, inputs.children, eventDate]);

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
                        addons: event.selectedAddon.map(item => item.id)
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
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            fill
                            alt={event.title}
                            className="object-cover object-center rounded"
                            sizes="(max-width: 768px) 100vw, 560px"
                        />
                    ) : (
                        <div className="h-full w-full bg-[#E4E8E5] rounded" aria-hidden="true" />
                    )}
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
                    {[...new Set([...(event.activities ?? []), ...event.selectedAddon.map((f) => f.name)])].map((item) => (
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
                    <p>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</p>
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
                                    readOnly={(key === "children" && !event.childPrice) || (key === "adults" && !event.adultPrice)}
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

// ── EventCard ────────────────────────────────────────────────────────────
// Memoized so unrelated grid cards don't re-render when only one event's
// `selectedAddon` changes — that field is only read inside the modal, never
// by the card itself, but updating it still swaps the `event` object
// reference in the parent's `events` array.

interface EventCardProps {
    event: IEvent;
    index: number;
    onOpen: (index: number) => void;
    onShare: (index: number) => void;
}

const EventCard = React.memo(function EventCard({ event, index, onOpen, onShare }: EventCardProps) {
    const coverImage = event.images?.find((img) => typeof img === "string" && img.trim().length > 0) ?? null;
    const description = event.description?.trim() ?? "";
    return (
        <div className="relative">
            <div
                className="p-3 grid gap-2 font-inter cursor-pointer"
                onClick={() => onOpen(index)}
            >
                <div className="h-50 relative">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            fill
                            alt={event.title}
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-[#E4E8E5]" aria-hidden="true" />
                    )}
                </div>
                <div className="grid gap-1">
                    <p className="font-semibold text-lg font-playfair-display text-primaryGreen">
                        {event.title}
                    </p>
                    <p className="font-lato text-[#4B6450] text-sm font-light">
                        {description
                            ? (description.length > 100 ? description.slice(0, 100) + "..." : description)
                            : "Event details will be shared soon."}
                    </p>
                    <p className="font-lato text-primaryGreen text-sm mt-6 font-medium">
                        {new Date(event.date).toLocaleDateString("en-us", { dateStyle: "medium" })}
                    </p>
                    <p className="font-lato text-primaryGreen/80 text-xs font-medium">
                        {`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onShare(index);
                }}
                className="w-7 h-7 absolute top-5 right-5 bg-white flex items-center justify-center cursor-pointer rounded-full shadow"
                aria-label="Share event"
            >
                <Share2 size={14} />
            </button>
        </div>
    );
});

// ── Page ───────────────────────────────────────────────────────────────

interface EventsFeedProps {
    // When set (visiting /events/[slug] directly, e.g. a shared link), the
    // matching event's modal auto-opens once the feed has loaded.
    initialSlug?: string;
}

export default function EventsFeed({ initialSlug }: EventsFeedProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);


    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showShareModal, setShareModal] = useState<boolean>(false);

    const handleOpenModal = useCallback((index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        // Opened via a direct /events/[slug] link — closing should land back
        // on the plain feed URL instead of leaving the slug in the address bar.
        if (pathname !== "/events") {
            router.replace("/events");
        }
    }, [pathname, router]);

    const handleShareClick = useCallback((index: number) => {
        setSelectedIndex(index);
        setShareModal(true);
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

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        const getStatus = (event: (typeof events)[number]) => {
            const date = parseLocalDate(event.date);
            if (date >= startOfToday && date < endOfToday) return "Ongoing";
            if (date >= endOfToday) return "Upcoming";
            return "Passed";
        };

        if (activeFilter === "All") {
            const statusOrder: Record<string, number> = {
                Ongoing: 0,
                Upcoming: 1,
                Passed: 2,
            };
            return [...indexed].sort(
                (a, b) => statusOrder[getStatus(a.event)] - statusOrder[getStatus(b.event)]
            );
        }

        return indexed.filter(({ event }) => getStatus(event) === activeFilter);
    }, [activeFilter, events]);

    const selectedEvent = selectedIndex !== null ? events[selectedIndex] : null;
    useEffect(() => {
        let cancelled = false;
        document.body.style.overflow = "hidden"; // Disable scrolling while loading
        (async () => {
            try {
                const req = await axios.get<EventsApiResponse>("../api/events");
                if (cancelled) return;
                const resEvents: IEventClient[] = req.data.data.events;
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

    // Auto-open the matching event's modal once the feed has loaded, for
    // direct/shared links to /events/[slug]. If the slug doesn't match any
    // event, fall back to the plain feed instead of leaving a dead modal state.
    // Guarded by a ref (rather than a narrowed dependency array) so it fires
    // exactly once per slug, even though `events`/`handleOpenModal` also
    // legitimately belong in the dependency array.
    const autoOpenedSlugRef = useRef<string | null>(null);
    useEffect(() => {
        if (!initialSlug || isLoading) return;
        if (autoOpenedSlugRef.current === initialSlug) return;
        autoOpenedSlugRef.current = initialSlug;

        const index = events.findIndex((event) => event.slug === initialSlug);
        if (index === -1) {
            router.replace("/events");
            return;
        }
        handleOpenModal(index);
    }, [initialSlug, isLoading, events, handleOpenModal, router]);

    if (isLoading) {
        return <Loading />
    }

    const eventShareUrl = (event: IEvent) =>
        `${window.location.origin}/events/${event.slug}`;

    return (
        <div className="pt-10 ">
            <Modal isOpen={modalOpen} handleClose={handleCloseModal}>
                {selectedEvent && (
                    // key forces a fresh mount (and state reset) when a different event is opened
                    <EventModalContent
                        key={selectedEvent.id ?? selectedEvent.slug ?? String(selectedIndex)}
                        event={selectedEvent}
                        onClose={handleCloseModal}
                        onConfirmFun={handleConfirmFun}
                    />
                )}
            </Modal>

            <ShareModal
                isOpen={!!showShareModal}
                onClose={() => setShareModal(false)}
                url={selectedEvent ? eventShareUrl(selectedEvent) : ''}
                title={selectedEvent?.title ?? ''}
            />

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
                {filteredEvents.map(({ event, index }) => (
                    <EventCard
                        key={event.id ?? `${event.slug}-${index}`}
                        event={event}
                        index={index}
                        onOpen={handleOpenModal}
                        onShare={handleShareClick}
                    />
                ))}
            </div>
        </div>
    );
}
