import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";

function FounderIcon({ letter, color }) {
    return (
        <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
                width: 96,
                height: 96,
                background: "#e0e7ff",
                color: color || "#2563eb",
                fontWeight: "bold",
                fontSize: "2.5rem",
                border: `3px solid ${color || "#2563eb"}`,
                userSelect: "none",
            }}
        >
            {letter}
        </div>
    );
}
//removal
export default function DesktopAbout() {
    return (
        <div className="bg-white text-[#171717] font-sans">
            <Head>
                <title>About | MyPropertyPal</title>
                <meta name="description" content="Meet the founders and story behind MyPropertyPal. Built by landlords, for landlords." />
                <meta name="robots" content="index, follow" /> {/* Robots meta tag */}
                <meta property="og:title" content="About | MyPropertyPal" />
                <meta property="og:description" content="Meet the founders and story behind MyPropertyPal. Built by landlords, for landlords." />
                <meta property="og:image" content="/LogoWB.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About | MyPropertyPal" />
                <meta name="twitter:description" content="Meet the founders and story behind MyPropertyPal. Built by landlords, for landlords." />
                <meta name="twitter:image" content="/LogoWB.png" />
                <link rel="icon" href="/LogoWB.png" />
            </Head>
            {/* Use desktop header on md+ and mobile header on mobile */}
            <div className="hidden md:block">
                <Header />
            </div>
            <div className="block md:hidden">
                <MobileHeader />
            </div>

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto text-center py-16 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#2563eb]">
                    Great Property Management,<br className="hidden md:block" /> Needs a Great Team.
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    We're three founders combining property passion and tech to change the rental game.
                </p>
            </section>

            {/* About the Company */}
            <section className="max-w-3xl mx-auto py-8 px-4 text-center">
                <p className="text-xl text-gray-800">
                    We’re three students with a passion for property.
                    So we built the tool we are going to use. MyPropertyPal is our way of turning our skills into something useful — for ourselves and others.
                </p>
            </section>

            {/* Meet the Founders */}
            <section className="max-w-6xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-[#2563eb]">Meet the Founders</h2>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                    {/* Tommy Rowe */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
                        <FounderIcon letter="T" color="#2563eb" />
                        <h3 className="text-xl font-bold mb-1 text-[#2563eb]">Tommy Rowe</h3>
                        <div className="text-sm text-gray-500 mb-1">The Builder</div>
                        <div className="text-sm text-gray-700 mb-2">CEO & Lead Developer</div>
                        <p className="text-gray-700 text-center text-base">
                            “Tommy writes the code and sets the vision. With a love for clean UX and no-nonsense tools, he brings landlord pain points into real features.”
                        </p>
                    </div>
                    {/* Fin Perkins */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
                        <FounderIcon letter="F" color="#2563eb" />
                        <h3 className="text-xl font-bold mb-1 text-[#2563eb]">Finn Perkins</h3>
                        <div className="text-sm text-gray-500 mb-1">The Engine</div>
                        <div className="text-sm text-gray-700 mb-2">Software Engineer</div>
                        <p className="text-gray-700 text-center text-base">
                            “Finn lives in the backend — the unsung hero behind our APIs, integrations, and platform performance. If it runs, he probably wrote it.”
                        </p>
                    </div>
                    {/* Chris Thomson */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
                        <FounderIcon letter="C" color="#2563eb" />
                        <h3 className="text-xl font-bold mb-1 text-[#2563eb]">Chris Thomson</h3>
                        <div className="text-sm text-gray-500 mb-1">The Strategist</div>
                        <div className="text-sm text-gray-700 mb-2">Head of Marketing & Business Strategy</div>
                        <p className="text-gray-700 text-center text-base">
                            “Chris connects the tech to the people. He leads our marketing and business strategy with one mission: make landlords’ lives easier.”
                        </p>
                    </div>
                </div>
            </section>

            {/* Special Mentions */}
            <section className="max-w-6xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-[#2563eb]">Special Mentions</h2>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                    {/* Rowan Anstee */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
                        <FounderIcon letter="R" color="#2563eb" />
                        <h3 className="text-xl font-bold mb-1 text-[#2563eb]">Rowan Anstee</h3>
                        <div className="text-sm text-gray-500 mb-1">The Creative</div>
                        <div className="text-sm text-gray-700 mb-2">Presentation Designer</div>
                        <p className="text-gray-700 text-center text-base">
                            “Rowan helped develop stunning presentation assets for our Airbus Defence and Space presentation, ensuring our ideas were communicated with clarity and impact.”
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#2563eb] py-16 px-4 text-white text-center">
                <h2 className="text-3xl font-bold mb-3">
                    Want to see where we're going next?
                </h2>
                <p className="max-w-xl mx-auto mb-6 text-lg">
                    Follow our journey or get in touch — we're building MyPropertyPal for landlords like you.
                </p>
                <a
                    href="mailto:hello@mypropertypal.co.uk"
                    className="inline-block bg-white text-[#2563eb] font-semibold rounded-lg px-8 py-3 shadow hover:bg-blue-100 transition"
                >
                    Contact Us
                </a>
            </section>

            <Footer />
        </div>
    );
}