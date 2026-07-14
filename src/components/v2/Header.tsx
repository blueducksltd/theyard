"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },

    { href: "/faqs", label: "FAQs" },
    { href: "/gallery", label: "Gallery" },
    { href: "/terms", label: "Our terms" },
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
            <header className="fixed top-0 left-0 right-0 z-500">
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
                    <div className="flex items-center justify-center gap-x-5 bg-primaryGreen py-1 px-10 h-full relative">
                        <Link
                            href="/booking/calendar"
                            className="relative bg-primaryBrown border border-lightBrown text-xs text-white py-2 px-5 flex items-center gap-3 hover:opacity-90 transition-opacity"
                        >
                            Book Now
                            <Calendar size={16} aria-hidden="true" />
                        </Link>

                        {/* Desktop Dropdown */}
                        <div ref={desktopRef} className="">
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

                            <div
                                id="desktop-menu"
                                role="menu"
                                aria-hidden={!desktopOpen}
                                className={`absolute right-0 top-full w-full z-50 grid border border-black/10 bg-primaryGreen transition-all duration-500 ease-in-out ${desktopOpen
                                    ? "grid-rows-[1fr] opacity-100 visible"
                                    : "grid-rows-[0fr] opacity-0 invisible"
                                    }`}
                                style={{
                                    backdropFilter: "blur(40px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
                                }}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-1.5">
                                        {NAV_LINKS.map((link, i) => (
                                            <div key={link.href}>
                                                {i === 3 && <div className="my-1 h-px bg-black/10" />}
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setDesktopOpen(false)}
                                                    role="menuitem"
                                                    tabIndex={desktopOpen ? 0 : -1}
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
                            </div>
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
                            href="/booking/calendar"
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
                <div
                    id="mobile-menu"
                    aria-hidden={!mobileOpen}
                    className={`fixed inset-x-0 top-14 bottom-0 md:hidden z-40 grid transition-all duration-500 ease-in-out ${mobileOpen
                        ? "grid-rows-[1fr] opacity-100 visible"
                        : "grid-rows-[0fr] opacity-0 invisible"
                        }`}
                >
                    <div className="overflow-hidden bg-primaryGreen">
                        <div className="h-full overflow-y-auto p-6 space-y-1">
                            {NAV_LINKS.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    tabIndex={mobileOpen ? 0 : -1}
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
                </div>
            </header>

            {/* <div className="h-20"></div> */}
        </>

    );
}