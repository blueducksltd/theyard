"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/v2", label: "Home" },
    { href: "/v2/packages", label: "Packages" },
    { href: "/v2/events", label: "Events" },
    { href: "/v2/about", label: "About" },

    { href: "/v2/faqs", label: "FAQs" },
    { href: "/v2/gallery", label: "Gallery" },
    { href: "/v2/contact", label: "Contact Us" },
];

export default function Header() {
    const pathname = usePathname();
    const [desktopOpen, setDesktopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const desktopRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => pathname === href;

    // Close menus on route change
    useEffect(() => {
        setDesktopOpen(false);
        setMobileOpen(false);
    }, [pathname]);

    // Click outside to close desktop dropdown
    useEffect(() => {
        if (!desktopOpen) return;
        const handler = (e: PointerEvent) => {
            if (!desktopRef.current?.contains(e.target as Node)) {
                setDesktopOpen(false);
            }
        };
        document.addEventListener("pointerdown", handler);
        return () => document.removeEventListener("pointerdown", handler);
    }, [desktopOpen]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                {/* ── DESKTOP NAV ── */}
                <nav className="hidden md:flex items-center justify-between h-14 ">
                    {/* Logo */}
                    <div className="flex items-center justify-center bg-primaryGreen p-1 w-[15%] h-full">
                        <div className="w-14 h-full relative">
                            <Link href="/">
                                <Image
                                    src="/images/logo.png"
                                    fill
                                    alt="Logo"
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center justify-center gap-x-5 bg-primaryGreen py-1 px-10 h-full">
                        <Link
                            href="/v2/booking/calendar"
                            className="relative bg-primaryBrown border border-lightBrown text-xs text-white py-2 px-5 flex items-center gap-3 hover:opacity-90 transition-opacity"
                        >
                            Book Now
                            <Calendar size={16} aria-hidden="true" />
                        </Link>

                        {/* Desktop Dropdown */}
                        <div ref={desktopRef} className="relative">
                            <button
                                onClick={() => setDesktopOpen((p) => !p)}
                                aria-expanded={desktopOpen}
                                aria-controls="desktop-menu"
                                aria-haspopup="menu"
                                className="bg-[#0E3121] text-xs text-lightBrown border-lightBrown py-2 px-5 flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Menu
                                <Menu size={16} aria-hidden="true" />
                            </button>

                            {desktopOpen && (
                                <div
                                    id="desktop-menu"
                                    role="menu"
                                    className="absolute right-0 top-[calc(100%+8px)] min-w-55 z-50 overflow-hidden rounded-xl border border-black/10 animate-in fade-in slide-in-from-top-2 duration-7000 bg-primaryGreen "
                                    style={{
                                        backdropFilter: "blur(40px) saturate(180%)",
                                        WebkitBackdropFilter: "blur(40px) saturate(180%)",
                                        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <div className="p-1.5">
                                        {NAV_LINKS.map((link, i) => (
                                            <div key={link.href}>
                                                {i === 3 && <div className="my-1 h-px bg-black/10" />}
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setDesktopOpen(false)}
                                                    role="menuitem"
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg  text-sm transition-colors duration-100 ${isActive(link.href)
                                                        ? "bg-black/10 font-medium text-white "
                                                        : " hover:bg-black/6 text-white/80 active:bg-black/10"
                                                        }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── MOBILE NAV ── */}
                <nav className="flex md:hidden items-center justify-between bg-primaryGreen p-2">
                    <Link href="/">
                        <Image
                            src="/images/logo.svg"
                            width={100}
                            height={100}
                            alt="Logo"
                            className="object-contain"
                            priority
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/v2/booking/calendar"
                            className="bg-primaryBrown border border-lightBrown  text-xs text-white py-2 px-4 flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            Book Now
                            <Calendar size={16} aria-hidden="true" />
                        </Link>

                        <button
                            onClick={() => setMobileOpen((p) => !p)}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            className={`${mobileOpen ? "bg-white w-16" : "text-lightBrown border-lightBrown  w-10"} flex items-center justify-center p-1 duration-700`}>
                            {mobileOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </nav>

                {/* ── MOBILE DRAWER ── */}
                {mobileOpen && (
                    <div
                        id="mobile-menu"
                        className="fixed inset-x-0 top-14 bottom-0 bg-primaryGreen md:hidden z-40 overflow-y-auto"
                    >
                        <div className="p-6 space-y-1">
                            {NAV_LINKS.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-right block px-4 py-3 rounded-lg text-lg transition-colors ${isActive(link.href)
                                        ? "bg-secondaryGreen font-medium text-black"
                                        : "text-white/80 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* <div className="h-20"></div> */}
        </>

    );
}