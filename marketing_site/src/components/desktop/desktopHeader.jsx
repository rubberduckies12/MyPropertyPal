import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const currentPath = router.pathname;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <header className="max-w-7xl mx-auto flex items-center justify-between py-8 px-6">
            <div className="flex items-center gap-2">
                <Image
                    src="/LogoWB.png"
                    alt="MyPropertyPal"
                    width={36}
                    height={36}
                />
                <span className="font-bold text-lg text-[#2563eb]">
                    MyPropertyPal
                </span>
            </div>
            <nav className="hidden md:flex gap-8 text-base font-medium items-center">
                <a
                    href="/"
                    className={`hover:text-[#2563eb] transition ${
                        currentPath === "/"
                            ? "text-[#2563eb] font-bold underline underline-offset-4"
                            : ""
                    }`}
                >
                    Home
                </a>
                <a
                    href="/product"
                    className={`hover:text-[#2563eb] transition ${
                        currentPath === "/product"
                            ? "text-[#2563eb] font-bold underline underline-offset-4"
                            : ""
                    }`}
                >
                    Product
                </a>
                <Link href="/about" passHref legacyBehavior>
                    <a
                        className={`hover:text-[#2563eb] transition ${
                            currentPath === "/about"
                                ? "text-[#2563eb] font-bold underline underline-offset-4"
                                : ""
                        }`}
                    >
                        About
                    </a>
                </Link>
                <Link href="/blog" passHref legacyBehavior>
                    <a
                        className={`hover:text-[#2563eb] transition ${
                            currentPath === "/blog"
                                ? "text-[#2563eb] font-bold underline underline-offset-4"
                                : ""
                        }`}
                    >
                        Blog
                    </a>
                </Link>
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className={`hover:text-[#2563eb] transition flex items-center gap-1 ${
                            (currentPath === "/terms" || currentPath === "/privacy")
                                ? "text-[#2563eb] font-bold underline underline-offset-4"
                                : ""
                        }`}
                        onClick={() => setShowDropdown((v) => !v)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        aria-haspopup="true"
                        aria-expanded={showDropdown}
                    >
                        Legal Stuff
                        <svg
                            className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                                showDropdown ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <a
                                href="/terms"
                                className={`block px-4 py-2 hover:bg-blue-50 transition ${
                                    currentPath === "/terms" ? "text-[#2563eb] font-bold" : ""
                                }`}
                            >
                                Terms and Conditions
                            </a>
                            <a
                                href="/privacy"
                                className={`block px-4 py-2 hover:bg-blue-50 transition ${
                                    currentPath === "/privacy" ? "text-[#2563eb] font-bold" : ""
                                }`}
                            >
                                Privacy Policy
                            </a>
                        </div>
                    )}
                </div>
            </nav>
            <a
                href="https://app.mypropertypal.com/"
                className="bg-[#2563eb] text-white font-semibold rounded-lg px-6 py-2 shadow hover:bg-blue-700 transition hidden md:block"
            >
                Login
            </a>
        </header>
    );
}