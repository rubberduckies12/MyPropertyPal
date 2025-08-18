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
import EmailListSection from "../../components/EmailListSection";

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
   /* {
        name: "Portfolio",
        price: 100,
        features: [
            "Every Feature. No Upsells",
            "Up to 30 Properties",
            "Unlimited Tenants per Property",
            "Up to 5 Additional Team Members",
            "Priority Email Support",
        ],
        featured: false,
    }, */
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
    const [direction, setDirection] = useState(0);
    const intervalRef = useRef();

    const prev = () => {
        setDirection(-1);
        setCurrent((c) => (c === 0 ? featureSlides.length - 1 : c - 1));
    };
    const next = () => {
        setDirection(1);
        setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleManualNav = (fn) => {
        clearInterval(intervalRef.current);
        fn();
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
    };

    return (
        <section className="w-full flex flex-col items-center py-20 px-2 sm:px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Powerful Features</h2>
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center"
                            style={{
                                minWidth: 0,
                                minHeight: 220,
                                boxSizing: "border-box",
                            }}
                        >
                            <div className="mb-4">{featureSlides[current].icon()}</div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#2563eb] text-center flex items-center justify-center" style={{ minHeight: "2.5em" }}>
                                {featureSlides[current].title}
                            </h3>
                            <p className="text-gray-700 text-center flex items-center justify-center text-base md:text-lg" style={{ minHeight: "3.5em" }}>
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
  const [showForm, setShowForm] = useState(false); // State to toggle the form modal
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
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

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://api.mypropertypal.com/api/leads", { // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true); // Mark form as submitted
      } else {
        console.error("Failed to submit form");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="bg-white text-[#171717] font-sans pt-16 md:pt-0 overflow-x-hidden">
      <Head>
  <title>MyPropertyPal – All-in-One Property Management</title>
  <meta name="description" content="Manage your properties effortlessly with MyPropertyPal. Track rent, expenses, compliance, and more in one place." />
  <meta name="robots" content="index, follow" /> {/* Robots meta tag */}
  <meta property="og:title" content="MyPropertyPal – All-in-One Property Management" />
  <meta property="og:description" content="Manage your properties effortlessly with MyPropertyPal. Track rent, expenses, compliance, and more in one place." />
  <meta property="og:image" content="/dashboard.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="MyPropertyPal – All-in-One Property Management" />
  <meta name="twitter:description" content="Manage your properties effortlessly with MyPropertyPal. Track rent, expenses, compliance, and more in one place." />
  <meta name="twitter:image" content="/dashboard.png" />
  <link rel="icon" href="/LogoWB.png" />
</Head>
            {/* Mobile App Coming Soon Banner - hidden on desktop */}
            <div className="w-full flex justify-center md:hidden">
                <div className="flex items-center gap-3 bg-[#2563eb] border border-[#2563eb] text-white px-4 py-2 rounded-b-xl shadow-sm mt-0 fixed top-0 left-0 right-0 z-50">
                    <BsHourglassSplit className="animate-spin-slow text-white" size={22} />
                    <span className="font-medium text-sm">
                        Mobile app is coming soon – Use our webapp in the meantime!
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
            <section className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-10 md:py-24">
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h1 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 text-[#2563eb] leading-tight">
                        The Only Way To<br className="hidden md:block" /> Manage Your Properties in 2025
                    </h1>
                    <h3 className="text-lg md:text-2xl font-semibold mb-2 text-[#2563eb] tracking-tight leading-snug" style={{ letterSpacing: "-0.5px" }}>
                        Win back time with MyPropertyPal.
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
                        Get your free landlord package now.
                    </p>
                    {/* Updated button to open the form modal */}
                    <button
                        className="bg-[#2563eb] text-white font-semibold rounded-lg px-6 md:px-8 py-3 shadow hover:bg-blue-700 transition w-full md:w-auto"
                        onClick={() => setShowForm(true)} // Show the form modal
                    >
                        Download Free Starter Kit Now
                    </button>
                </div>
                <div className="flex justify-center">
                    <div
                        className="w-full max-w-md h-40 md:h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in"
                        title="Dashboard Preview"
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

            {/* Form Modal */}
            {showForm && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    style={{ background: "transparent" }} // Remove the dark background
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md pointer-events-auto"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000, // Ensure it appears above everything
      }}
    >
      {!formSubmitted ? (
        <>
          <h2 className="text-xl font-bold text-center mb-4">
            Enter Your Info to Get Your Free Guide
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
          <button
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Thank You!</h2>
          <p className="mb-4">Your free guide is ready to download.</p>
          <a
            href="/Landlord-Starter-Kit.zip"
            download
            className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            Download Now
          </a>
          <button
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            onClick={() => setShowForm(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
)}

            {/* Effortless Property Management section */}
            <section className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-20">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
                        Cut Out The Need For Property Managers
                    </h2>
                    <p className="text-gray-700 mb-6 text-center md:text-left">
                        We get it, you can now finally take control of your property management, without spending hours on admin, and without being charged silly fees.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://app.mypropertypal.com/register"}
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
            <section className="bg-[#2563eb] py-20 px-4 sm:px-6 text-white text-center">
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

            {/* Email List Section */}
            <EmailListSection />

            {/* Powerful Features section */}
            <FeaturesSlider />

            {/* Stay Organised Section */}
            <section className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-20">
                <div className="flex justify-center w-full">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden flex justify-center items-center">
                        <OrbitGraphic className="w-full h-auto" />
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h2 className="text-3xl font-bold mb-4">Stay Organised</h2>
                    <p className="text-gray-700 mb-6 max-w-xl">
                        Never lose track of a payment or receipt again.
                        All your rental income, expenses, and tax records, automatically categorised, beautifully presented,
                        and always up to date. One login. One place. Zero spreadsheets.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://app.mypropertypal.com/register"}
                    >
                        Get Organised
                    </button>
                </div>
            </section>

            {/* Stay Compliant Section */}
            <section className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-20">
                <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h2 className="text-3xl font-bold mb-4">
                        Stay Compliant Effortlessly
                    </h2>
                    <p className="text-gray-700 mb-6">
                        From gas safety to EPC, never miss a deadline. We'll track your legal obligations and remind you
                        before anything is due. So you stay compliant without stress.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://app.mypropertypal.com/register"}
                    >
                        Never Miss a Deadline
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
            <section className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-4">How we are different</h2>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    Traditional platforms are either too simple, too clunky, or built for big agencies. 
                    MyPropertyPal gives smaller landlords everything they need — no fluff, no stress.
                </p>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[360px] sm:min-w-[600px] bg-white rounded-2xl mx-auto text-xs sm:text-base">
                        <thead>
                            <tr>
                                <th className="py-4 px-2 sm:py-5 sm:px-4 text-left font-semibold text-[#2563eb] border-b border-gray-100">Feature</th>
                                <th className="py-4 px-2 sm:py-5 sm:px-4 text-center font-semibold text-[#2563eb] border-b border-gray-100">MyPropertyPal</th>
                                <th className="py-4 px-2 sm:py-5 sm:px-4 text-center font-semibold text-[#2563eb] border-b border-gray-100">Traditional Ways to Manage</th>
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
                                    <td className="py-4 px-2 sm:py-6 sm:px-4 font-medium">{row.feature}</td>
                                    <td className="py-4 px-2 sm:py-6 sm:px-4 text-center">{row.mpp}</td>
                                    <td className="py-4 px-2 sm:py-6 sm:px-4 text-center">{row.other}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Pricing Table */}
            <section className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-center text-gray-700 mb-12">
                    Whether you're renting out your first flat or juggling a handful of properties,
                    MyPropertyPal is built with you in mind. <br /><br />
                    <span className="font-semibold">Start simple. Grow with confidence.</span>
                </p>
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
                            } p-8 flex flex-col items-start min-w-0`}
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
                                onClick={() => window.location.href = "https://app.mypropertypal.com/register"}
                            >
                                Get Started Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Your data and payments are safe section */}
            <section className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-center">Your data and payments are safe</h3>
                <div className="flex flex-wrap gap-6 justify-center items-center">
                    <div className="flex flex-col items-center">
                        <BsShieldCheck size={48} className="text-[#2563eb] mb-1" />
                        <span className="text-xs font-bold text-[#2563eb]">GDPR Compliant</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaCcStripe size={48} className="text-[#2563eb] mb-1" />
                        <span className="text-xs font-bold text-[#2563eb]">Stripe Secure Payments</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaLock size={48} className="text-[#2563eb] mb-1" />
                        <span className="text-xs font-bold text-[#2563eb]">SSL Encrypted</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <MdHttps size={48} className="text-[#2563eb] mb-1" />
                        <span className="text-xs font-bold text-[#2563eb]">HTTPS Secure</span>
                    </div>
                </div>
            </section>

            {/* Bottom blue guarantee section */}
            <section className="bg-[#2563eb] py-16 px-4 sm:px-6 text-white text-center">
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

            {/* Existing Footer */}
            <Footer />
        </div>
    );
}