import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MobileHeader() {
    const router = useRouter();
    const currentPath = router.pathname;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
                <Image
                    src="/LogoWB.png"
                    alt="MyPropertyPal"
                    width={32}
                    height={32}
                />
                <span className="font-bold text-base text-[#2563eb]">
                    MyPropertyPal
                </span>
            </div>
            <div className="flex items-center gap-4">
                {/* Login Button */}
                <a
                    href="https://app.mypropertypal.com/"
                    className="text-[#2563eb] font-semibold text-sm border border-[#2563eb] rounded-lg px-4 py-1 hover:bg-blue-50 transition"
                >
                    Login
                </a>
                {/* Hamburger Icon */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Open navigation menu"
                >
                    <svg width={28} height={28} fill="none" stroke="#2563eb" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
            {menuOpen && (
                <nav className="absolute top-16 left-0 w-full bg-white shadow-lg z-50 flex flex-col items-start px-6 py-4 gap-4 border-t border-gray-100">
                    <a
                        href="/"
                        className={`w-full py-2 ${currentPath === "/" ? "text-[#2563eb] font-bold underline underline-offset-4" : "text-gray-900"} transition`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </a>
                    <a
                        href="/product"
                        className={`w-full py-2 ${currentPath === "/product" ? "text-[#2563eb] font-bold underline underline-offset-4" : "text-gray-900"} transition`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Product
                    </a>
                    <a
                        href="/about"
                        className={`w-full py-2 ${currentPath === "/about" ? "text-[#2563eb] font-bold underline underline-offset-4" : "text-gray-900"} transition`}
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </a>
                    <div className="w-full">
                        <span className="block text-gray-900 font-medium mb-1">Legal Stuff</span>
                        <a
                            href="/terms"
                            className={`block pl-4 py-2 ${currentPath === "/terms" ? "text-[#2563eb] font-bold underline underline-offset-4" : "text-gray-900"} transition`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Terms and Conditions
                        </a>
                        <a
                            href="/privacy"
                            className={`block pl-4 py-2 ${currentPath === "/privacy" ? "text-[#2563eb] font-bold underline underline-offset-4" : "text-gray-900"} transition`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Privacy Policy
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
}