import Image from "next/image";
import { FaLinkedin } from "react-icons/fa"; // Import the LinkedIn icon

export default function Footer() {
    return (
        <footer className="bg-blue-50 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                    <Image
                        src="/LogoWB.png"
                        alt="MyPropertyPal"
                        width={32}
                        height={32}
                    />
                    <span className="font-bold text-lg text-[#2563eb]">
                        MyPropertyPal
                    </span>
                </div>
                <div className="flex flex-wrap gap-6 text-base font-medium justify-center md:justify-start">
                    <a href="/" className="hover:text-[#2563eb] transition">Home</a>
                    <a href="/about" className="hover:text-[#2563eb] transition">About</a>
                    <a href="/terms" className="hover:text-[#2563eb] transition">Terms &amp; Conditions</a>
                    <a href="/privacy" className="hover:text-[#2563eb] transition">Privacy Policy</a>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://www.linkedin.com/company/my-property-pal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563eb] hover:text-blue-700 transition"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin size={24} />
                    </a>
                    <div className="text-gray-500 text-sm text-center md:text-right">
                        &copy; {new Date().getFullYear()} MyPropertyPal
                    </div>
                </div>
            </div>
        </footer>
    );
}