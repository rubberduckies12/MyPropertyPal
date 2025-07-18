import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";
import { MdOutlineNotificationsActive, MdGavel, MdHomeRepairService, MdPeople, MdOutlineManageAccounts } from "react-icons/md";
import { HiOutlineDocument, HiOutlineChatBubbleLeftRight, HiOutlineWrenchScrewdriver, HiOutlineBolt } from "react-icons/hi2";
import { PiRobotLight } from "react-icons/pi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { BsStars } from "react-icons/bs";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const brand = "#2563eb";

const plans = [
    {
        name: "Basic",
        price: 30,
        features: [
            "All Features Included",
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
            "All Features Included",
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

// Example features for the slider, now with React Icons
const featureSlides = [
    {
        title: "Tenant Messages",
        description: "Communicate directly and securely with your tenants in one place.",
        icon: <HiOutlineChatBubbleLeftRight size={48} color={brand} />,
    },
    {
        title: "Compliance Tracking",
        description: "Track and manage all your compliance requirements with ease.",
        icon: <MdGavel size={48} color={brand} />,
    },
    {
        title: "Find Home Improvement Professionals",
        description: "Easily connect with trusted tradespeople for any property job.",
        icon: <MdHomeRepairService size={48} color={brand} />,
    },
    {
        title: "Tenant Management",
        description: "Organise, track, and manage all your tenants from one dashboard.",
        icon: <MdPeople size={48} color={brand} />,
    },
    {
        title: "Property Management",
        description: "All your properties, documents, and tasks managed in one place.",
        icon: <MdOutlineManageAccounts size={48} color={brand} />,
    },
    {
        title: "Automated Rent Collection",
        description: "Collect rent automatically with flexible, variable payment options.",
        icon: <FaRegMoneyBillAlt size={48} color={brand} />,
    },
    {
        title: "Maintenance Requests Tracking",
        description: "Dedicated tools for tenants to submit and track maintenance requests.",
        icon: <HiOutlineWrenchScrewdriver size={48} color={brand} />,
    },
    {
        title: "AI Support",
        description: "Get instant answers and support with our built-in AI assistant.",
        icon: <PiRobotLight size={48} color={brand} />,
    },
    {
        title: "AI Powered Expense Logging (BETA)",
        description: "Log and categorise expenses automatically using AI (Beta).",
        icon: <HiOutlineBolt size={48} color={brand} />,
    },
    {
        title: "HMRC Compliant Tax Automation",
        description: "Automate your tax calculations and submissions, fully HMRC compliant.",
        icon: <TbReportMoney size={48} color={brand} />,
    },
];

function FeaturesSlider() {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef();

    const prev = () => setCurrent((c) => (c === 0 ? featureSlides.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));

    // Auto-advance every 4 seconds
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Reset timer on manual navigation
    const handleManualNav = (fn) => {
        clearInterval(intervalRef.current);
        fn();
        intervalRef.current = setInterval(() => {
            setCurrent((c) => (c === featureSlides.length - 1 ? 0 : c + 1));
        }, 3000);
    };

    return (
        <section className="max-w-3xl mx-auto py-20 px-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-8">Powerful Features</h2>
            <div className="relative w-full flex flex-col items-center">
                <div className="bg-white rounded-2xl shadow-lg p-10 w-full flex flex-col items-center transition-all duration-300">
                    <div className="mb-4">{featureSlides[current].icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-[#2563eb] text-center">{featureSlides[current].title}</h3>
                    <p className="text-gray-700 text-center">{featureSlides[current].description}</p>
                </div>
                <div className="flex gap-4 mt-8">
                    <button
                        aria-label="Previous feature"
                        onClick={() => handleManualNav(prev)}
                        className="w-10 h-10 rounded-full border border-[#2563eb] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
                    >
                        <HiChevronLeft size={28} />
                    </button>
                    <button
                        aria-label="Next feature"
                        onClick={() => handleManualNav(next)}
                        className="w-10 h-10 rounded-full border border-[#2563eb] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
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
        </section>
    );
}

export default function Landing() {
    const [billing, setBilling] = useState("monthly");
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
        <div className="bg-white text-[#171717] font-sans">
            <Head>
                <title>MyPropertyPal | Effortless Property Management</title>
                <meta name="description" content="MyPropertyPal helps landlords and tenants manage properties, rent, compliance, and communication with ease. 30-day money back guarantee." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="MyPropertyPal | Effortless Property Management" />
                <meta property="og:description" content="All-in-one platform for landlords and tenants. Automated rent collection, compliance, maintenance, and more." />
                <meta property="og:image" content="/LogoWB.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MyPropertyPal | Effortless Property Management" />
                <meta name="twitter:description" content="All-in-one platform for landlords and tenants. Automated rent collection, compliance, maintenance, and more." />
                <meta name="twitter:image" content="/LogoWB.png" />
                <link rel="icon" href="/LogoWB.png" />
            </Head>
            {/* Show desktop header on md+ screens, mobile header on mobile */}
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
                        Win Back your Time <br className="hidden md:block" />with MyPropertyPal
                    </h1>
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
                    <div className="w-full max-w-md h-40 md:h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
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
                        Effortless Property{" "}
                        <span className="bg-yellow-100 px-2 rounded">Management</span>
                    </h2>
                    <p className="text-gray-700 mb-6 text-center md:text-left">
                        Streamline your rental business with powerful tools, built for
                        landlords and tenants. Stay organised, stay compliant, and reclaim
                        more time.
                    </p>
                    <button
                        className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                        onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                    >
                        Get Started
                    </button>
                </div>
                {/* Feature Section 1 image box (2) */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
                        <Image
                            src="/add-tenants.png" // <-- updated to your dashboard preview
                            alt="Add Tenants Preview"
                            width={600}
                            height={300}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                </div>
            </section>


            {/* Stay Organised Section - graph left, text right */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-20">
                {/* Graphic on the left */}
                <div className="flex justify-center">
                    <Image
                        src="/stay-org.png"
                        alt="Stay Organised Graphic"
                        width={600}
                        height={600}
                        //className="rounded-xl shadow"
                        priority={false}
                    />
                </div>
                {/* Text content on the right */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <h3 className="text-2xl font-bold mb-4">Stay Organised</h3>
                    <p className="text-gray-700 mb-6 max-w-xl">
                        All of your rental income and expenses tracked and categorised for you,
                        so you always know what’s important. One login, one simple app.
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
            <div className="flex justify-center order-2 md:order-1">
                <div className="w-full max-w-md h-64 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    <Image
                        src="/finances.png" // <-- updated to your dashboard preview
                        alt="Finances Preview"
                        width={600}
                        height={300}
                        className="object-cover w-full h-full"
                        priority
                    />
                </div>
            </div>
            <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left w-full">
                <h2 className="text-3xl font-bold mb-4">
                    Stay Compliant {" "}
                    <span className="bg-yellow-100 px-2 rounded">Effortlessly</span>
                </h2>
                <p className="text-gray-700 mb-6">
                    Whether you’re managing a single property or a whole portfolio, we’re
                    here to support you every step. MyPropertyPal is always by your side.
                </p>
                <button
                    className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-lg px-8 py-3 hover:bg-[#2563eb] hover:text-white transition w-full md:w-auto text-center"
                    onClick={() => window.location.href = "https://my-property-pal-front.vercel.app/register"}
                >
                    Get Started
                </button>
            </div> {/* <-- Add this line to close the div */}
        </section>

            {/* Pricing Table */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-center text-gray-700 mb-12">
                    Whether you want to manage your first buy to let, or your seventh HMO or
                    hundreds! We have a plan for you.
                </p>
                {/* Billing toggle */}
                <div className="flex justify-center mb-8">
                    <button
                        className={`px-6 py-2 rounded-l-lg border border-[#2563eb] font-semibold transition ${
                            billing === "monthly"
                                ? "bg-[#2563eb] text-white"
                                : "bg-white text-[#2563eb]"
                        }`}
                        onClick={() => setBilling("monthly")}
                    >
                        Monthly
                    </button>
                    <button
                        className={`px-6 py-2 rounded-r-lg border border-[#2563eb] font-semibold transition ${
                            billing === "yearly"
                                ? "bg-[#2563eb] text-white"
                                : "bg-white text-[#2563eb]"
                        }`}
                        onClick={() => setBilling("yearly")}
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

            {/* Blue CTA Section */}
            <section className="bg-[#2563eb] py-20 px-6 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Everything Your Tenants Need, In One Place
                </h2>
                <p className="max-w-2xl mx-auto text-lg">
                    From maintenance requests to messages, our tenant portal gives your renters
                    a simple, secure way to manage their rental experience, No emails. No confusion.
                    Just a better way to communicate.
                </p>
            </section>
            <FeaturesSlider />

            <Footer />
        </div>
    );
}
