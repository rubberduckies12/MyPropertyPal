import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";
import { 
  MdOutlineNotificationsActive, 
  MdGavel, 
  MdHomeRepairService, 
  MdPeople, 
  MdOutlineManageAccounts, 
  MdHttps 
} from "react-icons/md";
import { HiOutlineDocument, HiOutlineChatBubbleLeftRight, HiOutlineWrenchScrewdriver, HiOutlineBolt, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { PiRobotLight } from "react-icons/pi";
import { FaRegMoneyBillAlt, FaPoundSign, FaCcStripe, FaLock } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { BsStars, BsHourglassSplit, BsClipboardCheck, BsShieldCheck, BsGlobe } from "react-icons/bs";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AiOutlineFileDone, AiOutlineRobot } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import OrbitGraphic from "../../components/OrbitGraphic";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const brand = "#2563eb";

const plans = [
    {
        name: "Basic",
        price: 30,
        features: [
            "Every Feature. No Upsells",
            "Up to 5 Properties",
            "Up to 4 Tenants per Property",
            "Email Support",
        ],
        featured: false,
    },
    {
        name: "Professional",
        price: 50,
        features: [
            "Every Feature. No Upsells",
            "Up to 10 Properties",
            "Up to 8 Tenants per Property",
            "Up to 2 Additional Team Members",
            "Priority Email Support",
        ],
        featured: true,
    },
    {
        name: "Organisation",
        price: 250,
        features: [
            "Unlimited Properties",
            "Unlimited Tenants",
            "Unlimited Additional Team Members",
            "Dedicated Account Manager",
        ],
        featured: false,
    },
];

// All icons as functions for consistency
const featureSlides = [
  {
    title: "Tenant Chat, Without the Chaos",
    description: "No more WhatsApps, emails or calls — message tenants securely and keep a record of everything in one place.",
    icon: () => <HiOutlineChatBubbleLeftRight size={48} color={brand} />,
  },
  {
    title: "Never Miss a Legal Deadline",
    description: "Track gas safety, EPCs, and all compliance in one dashboard — with automatic alerts and reminders.",
    icon: () => <MdGavel size={48} color={brand} />,
  },
  {
    title: "Find Reliable Trades in Seconds",
    description: "Need a plumber or electrician fast? Instantly connect with vetted contractors nearby — no chasing quotes.",
    icon: () => <MdHomeRepairService size={48} color={brand} />,
  },
  {
    title: "Tenant Records Made Simple",
    description: "View tenancy agreements, rent status, and documents — all linked to the right tenant, automatically.",
    icon: () => <MdPeople size={48} color={brand} />,
  },
  {
    title: "One Dashboard for Everything",
    description: "Track your entire portfolio, from rent collection to documents — no more spreadsheets or folder hunting.",
    icon: () => <MdOutlineManageAccounts size={48} color={brand} />,
  },
  {
    title: "Handle Repairs Without Headaches",
    description: "Tenants log issues, you update progress in a click. Everyone stays informed, no extra calls.",
    icon: () => <HiOutlineWrenchScrewdriver size={48} color={brand} />,
  },
  {
    title: "AI Assistant, Always On",
    description: "Instant help with any task — from rent queries to compliance questions. Your personal property sidekick.",
    icon: () => <PiRobotLight size={48} color={brand} />,
  },
  {
    title: "Snap Receipts, Done.",
    description: "Log expenses instantly. Our AI auto-categorises and stores them — ready for tax season.",
    icon: () => <HiOutlineBolt size={48} color={brand} />,
  },
  {
    title: "Stress-Free Tax Submissions",
    description: "Your rent, expenses and receipts — automatically formatted for HMRC’s MTD requirements.",
    icon: () => <TbReportMoney size={48} color={brand} />,
  },
];

function FeaturesSlider() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
    const intervalRef = useRef();

    const prev = () => {
        setDirection(-1);
        setCurrent((c) => (c === 0 ? featureSlides.length - 1 : c - 1));
    };
    const next = () => {
        setDirection(1);
        setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
    };

    // Auto-advance every 3 seconds
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Reset timer on manual navigation
    const handleManualNav = (fn) => {
        clearInterval(intervalRef.current);
        fn();
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
    };

    return (
        <section className="max-w-3xl mx-auto py-20 px-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-8">Powerful Features</h2>
            <div
                className="relative w-full flex flex-col items-center"
                style={{
                    minHeight: 340,
                    height: 340, // <-- Fixed height for the whole slider area
                    overflow: "hidden", // Prevents content from overflowing and shifting
                }}
            >
                <div className="w-full flex flex-col items-center h-full">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="bg-white rounded-2xl shadow-lg p-6 w-full flex flex-col items-center h-full"
                            style={{
                                height: "100%", // Fill the parent container
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}
                        >
                            <div className="mb-4">{featureSlides[current].icon()}</div>
                            <h3
                                className="text-xl font-bold mb-2 text-[#2563eb] text-center"
                                style={{
                                    minHeight: "2.5em",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {featureSlides[current].title}
                            </h3>
                            <p
                                className="text-gray-700 text-center"
                                style={{
                                    minHeight: "3.5em",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {featureSlides[current].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-4 mt-8">
                        <button
                            aria-label="Previous feature"
                            onClick={() => handleManualNav(prev)}
                            className="w-10 h-10 rounded-full border border-[#2563eb] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition cursor-pointer"
                        >
                            <HiChevronLeft size={28} />
                        </button>
                        <button
                            aria-label="Next feature"
                            onClick={() => handleManualNav(next)}
                            className="w-10 h-10 rounded-full border border-[#2563eb] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition cursor-pointer"
                        >
                            <HiChevronRight size={28} />
                        </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {featureSlides.map((_, idx) => (
                            <span
                                key={idx}
                                className={`w-3 h-3 rounded-full ${idx === current ? "bg-[#2563eb]" : "bg-blue-100"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FullScreenImageModal({ src, alt, onClose }) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      style={{ cursor: "zoom-out" }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff" }}
      />
      <button
        className="absolute top-6 right-6 text-white text-3xl font-bold"
        onClick={onClose}
        aria-label="Close"
        style={{ cursor: "pointer" }}
      >
        &times;
      </button>
    </div>,
    document.body
  );
}

export default function Landing() {
    const [billing, setBilling] = useState("monthly");
    const [modalImg, setModalImg] = useState(null);
    const discount = 0.15;

    function getPlanPrice(plan) {
        if (billing === "yearly") {
            const yearly = plan.price * 12 * (1 - discount);
            return `£${yearly.toFixed(0)}`;
        }
        return `£${plan.price}`;
    }

    function getPlanPeriod() {
        return billing === "yearly" ? "per year (15% off)" : "per month";
    }

    return (
        <div className="bg-white text-[#171717] font-sans pt-16 md:pt-0">
            <Head>
                <title>MyPropertyPal</title>
                <meta name="description" content="All-in-one property management for landlords. Track rent, expenses, compliance, and more." />
                <link rel="icon" href="/favicon.ico" />
                {/* Add more meta tags as needed */}
            </Head>
            {/* Mobile App Coming Soon Banner - hidden on desktop */}
            <div className="w-full flex justify-center md:hidden">
                <div className="flex items-center gap-3 bg-[#2563eb] border border-[#2563eb] text-white px-4 py-2 rounded-b-xl shadow-sm mt-0 fixed top-0 left-0 right-0 z-50">
                    <BsHourglassSplit className="animate-spin-slow text-white" size={22} />
                    <span className="font-medium text-sm">
                        Mobile app is coming soon – join us on desktop for the best experience in the meantime!
                    </span>
                </div>
            </div>
            {/* Header always visible */}
            <div className="hidden md:block">
                <Header />
            </div>
            <div className="block md:hidden">
                <MobileHeader />
            </div>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-10 md:py-24">
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h1 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 text-[#2563eb] leading-tight">
                        Win Back Your Time <br className="hidden md:block" />With MyPropertyPal
                    </h1>
                    <h3 className="text-lg md:text-2xl font-semibold mb-2 text-[#2563eb] tracking-tight leading-snug" style={{ letterSpacing: "-0.5px" }}>
                        Manage your rentals in minutes not hours
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
                        30-Day Money Back Guarantee. No Questions Asked.
                    </p>
                    {/* Hide on mobile, show on md+ */}
                    <button
                        className="hidden md:inline-block bg-[#2563eb] text-white font-semibold rounded-lg px-6 md:px-8 py-3 shadow hover:bg-blue-700 transition w-full md:w-auto"
                        onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                    >
                        Get your Free Demo
                    </button>
                </div>
                <div className="flex justify-center">
                    <div
                        className="w-full max-w-md h-40 md:h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in"
                        onClick={() => setModalImg({ src: "/dashboard.png", alt: "Dashboard Preview" })}
                        title="Click to view full screen"
                    >
                        <Image
                            src="/dashboard.png"
                            alt="Dashboard Preview"
                            width={600}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Effortless Property Management section (Feature Section 1) */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-20">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
                        Effortless Property Management
                    </h2>
                    <p className="text-gray-700 mb-6 text-center md:text-left">
                        All-in-one tools for small landlords who want less admin and more time. Stay compliant. Keep tenants happy. Get your evenings back.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                    >
                        Get Started
                    </button>
                </div>
                <div className="flex justify-center">
                    <div
                        className="w-full max-w-md h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in"
                        onClick={() => setModalImg({ src: "/add-tenants.png", alt: "Add Tenants Preview" })}
                        title="Click to view full screen"
                    >
                        <Image
                            src="/add-tenants.png"
                            alt="Add Tenants Preview"
                            width={600}
                            height={300}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Everything Your Tenants Need, In One Place */}
            <section className="bg-[#2563eb] py-20 px-6 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">
                    The Only Property Platform Built For Smaller Hands On Landlords
                </h2>
                <p className="max-w-2xl mx-auto text-lg">
                    We know you’re managing rent, chasing tenants, logging receipts — and now HMRC wants digital tax too?
                    <br /><br />MyPropertyPal handles it all.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6 mb-2">
                    <li className="flex flex-col items-center text-white">
                        <FaPoundSign size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">Track rent, expenses & tax in one place</span>
                    </li>
                    <li className="flex flex-col items-center text-white">
                        <IoReceiptOutline size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">Send tenants receipts & updates automatically</span>
                    </li>
                    <li className="flex flex-col items-center text-white">
                        <AiOutlineFileDone size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">Stay compliant without spreadsheets or stress</span>
                    </li>
                    <li className="flex flex-col items-center text-white">
                        <MdNotificationsActive size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">Get reminded when certificates expire</span>
                    </li>
                    <li className="flex flex-col items-center text-white">
                        <AiOutlineRobot size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">Built-in AI assistant for tenant questions</span>
                    </li>
                    <li className="flex flex-col items-center text-white">
                        <BsClipboardCheck size={32} className="mb-2" />
                        <span className="text-base font-medium text-center">30-day money back guarantee — no strings</span>
                    </li>
                </ul>
            </section>

            {/* Powerful Features section */}
            <FeaturesSlider />

            {/* Stay Organised Section - graph left, text right */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-20">
                {/* OrbitGraphic on the left */}
                <div className="flex justify-center">
                    <OrbitGraphic />
                </div>
                {/* Text content on the right */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h2 className="text-3xl font-bold mb-4">Stay Organised</h2>
                    <p className="text-gray-700 mb-6 max-w-xl">
                        Never lose track of a payment or receipt again.
                        All your rental income, expenses, and tax records, automatically categorised, beautifully presented,
                        and always up to date. One login. One place. Zero spreadsheets.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* Feature Section 2 */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-20">
                <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h2 className="text-3xl font-bold mb-4">
                        Stay Compliant Effortlessly
                    </h2>
                    <p className="text-gray-700 mb-6">
                        From gas saftey to EPC, never miss a deadline. We'll track your legal obligations and remind You
                        before anything is due. So you stay compliant without stress.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                    >
                        Get Started
                    </button>
                </div>
                <div className="flex justify-center order-2 md:order-1">
                    <div
                        className="w-full max-w-md h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in"
                        onClick={() => setModalImg({ src: "/finances.png", alt: "Finances Preview" })}
                        title="Click to view full screen"
                    >
                        <Image
                            src="/finances.png"
                            alt="Finances Preview"
                            width={600}
                            height={300}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* How we are different section */}
            <section className="max-w-4xl mx-auto px-4 md:px-0 py-16">
  <h2 className="text-3xl font-bold text-center mb-4">How we are different</h2>
  <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
    Traditional platforms are either too simple, too clunky, or built for big agencies. 
    MyPropertyPal gives smaller landlords everything they need — no fluff, no stress.
  </p>
  <div className="overflow-x-auto">
    <table className="w-full bg-white rounded-2xl shadow-lg">
      <thead>
        <tr>
          <th className="py-5 px-4 text-left text-base font-semibold text-[#2563eb] border-b border-gray-100">Feature</th>
          <th className="py-5 px-4 text-center text-base font-semibold text-[#2563eb] border-b border-gray-100">MyPropertyPal</th>
          <th className="py-5 px-4 text-center text-base font-semibold text-[#2563eb] border-b border-gray-100">Traditional Ways to Manage</th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            feature: "Simple, Modern Dashboard",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Often outdated & complex</span>,
          },
          {
            feature: "Built in AI Assistant For Instant Insights",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Not included</span>,
          },
          {
            feature: "Automated Compliance Tracking & Reminders",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Manual or limited</span>,
          },
          {
            feature: "Making Tax Digital (MTD) Ready",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Rarely supported</span>,
          },
          {
            feature: "Find Vetted Contractors Instantly",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Not included</span>,
          },
          {
            feature: "Automated Rent, Expense & Tax Tracking",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">Manual entry</span>,
          },
          {
            feature: "Built For Smaller UK Landlords",
            mpp: <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xl font-bold">✓</span>,
            other: <span className="text-gray-400">More general & Agency focused</span>,
          },
        ].map((row, i) => (
          <tr key={row.feature} className={i !== 6 ? "border-b border-gray-100" : ""}>
            <td className="py-6 px-4 text-base font-medium">{row.feature}</td>
            <td className="py-6 px-4 text-center">{row.mpp}</td>
            <td className="py-6 px-4 text-center">{row.other}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

            {/* Pricing Table */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-center text-gray-700 mb-12">
                    Whether you're renting out your first flat or juggling a handful of properties,
                    MyPropertyPal is built with you in mind. <br /><br />
                    <span className="font-semibold">Start simple. Grow with confidence.</span>
                </p>
                {/* Billing toggle */}
                <div className="flex justify-center mb-8 w-full max-w-xs mx-auto">
                    <button
                        className={`flex-1 px-6 py-2 rounded-l-lg border border-[#2563eb] font-semibold transition text-center ${
                            billing === "monthly"
                                ? "bg-[#2563eb] text-white"
                                : "bg-white text-[#2563eb]"
                        }`}
                        onClick={() => setBilling("monthly")}
                        style={{ minWidth: 0 }}
                    >
                        Monthly
                    </button>
                    <button
                        className={`flex-1 px-6 py-2 rounded-r-lg border border-[#2563eb] font-semibold transition text-center ${
                            billing === "yearly"
                                ? "bg-[#2563eb] text-white"
                                : "bg-white text-[#2563eb]"
                        }`}
                        onClick={() => setBilling("yearly")}
                        style={{ minWidth: 0 }}
                    >
                        Yearly
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`flex-1 rounded-2xl border ${
                                plan.featured
                                    ? "border-[#2563eb] bg-blue-50 shadow-lg scale-105"
                                    : "border-gray-200 bg-white shadow"
                            } p-8 flex flex-col items-start`}
                        >
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-3xl font-extrabold text-[#2563eb]">
                                    {getPlanPrice(plan)}
                                </span>
                                <span className="text-gray-600 font-medium">
                                    {getPlanPeriod()}
                                </span>
                            </div>
                            <div className="text-[#2563eb] font-semibold mb-4 text-sm">
                                30 Day Money Back Guarantee
                            </div>
                            <ul className="mb-8 space-y-3 w-full">
                                {plan.features.map((f, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 text-gray-700"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="#2563eb"
                                            strokeWidth="2.5"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M5 10.5l4 4 6-8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 w-full hover:bg-[#2563eb] hover:text-white transition"
                                onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Your data and payments are safe section */}
            <section className="max-w-4xl mx-auto py-10 px-6 flex flex-col items-center">
  <h3 className="text-lg font-semibold mb-4 text-center">Your data and payments are safe</h3>
  <div className="flex flex-wrap gap-6 justify-center items-center">
    {/* GDPR */}
    <div className="flex flex-col items-center">
      <BsShieldCheck size={48} className="text-[#2563eb] mb-1" />
      <span className="text-xs font-bold text-[#2563eb]">GDPR Compliant</span>
    </div>
    {/* Stripe */}
    <div className="flex flex-col items-center">
      <FaCcStripe size={48} className="text-[#2563eb] mb-1" />
      <span className="text-xs font-bold text-[#2563eb]">Stripe Secure Payments</span>
    </div>
    {/* SSL */}
    <div className="flex flex-col items-center">
      <FaLock size={48} className="text-[#2563eb] mb-1" />
      <span className="text-xs font-bold text-[#2563eb]">SSL Encrypted</span>
    </div>
    {/* HTTPS */}
    <div className="flex flex-col items-center">
      <MdHttps size={48} className="text-[#2563eb] mb-1" />
      <span className="text-xs font-bold text-[#2563eb]">HTTPS Secure</span>
    </div>
  </div>
</section>

            {/* Bottom blue guarantee section */}
            <section className="bg-[#2563eb] py-16 px-6 text-white text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Built for landlords. Backed by a 30-day money-back guarantee.
    </h2>
    <p className="max-w-xl mx-auto text-lg">
        Try It And Love It. Or Your Money Back. Guaranteed.
    </p>
</section>

            {/* Fullscreen Image Modal */}
            {modalImg && (
                <FullScreenImageModal
                    src={modalImg.src}
                    alt={modalImg.alt}
                    onClose={() => setModalImg(null)}
                />
            )}

            <Footer />
        </div>
    );
}
//mentlaist