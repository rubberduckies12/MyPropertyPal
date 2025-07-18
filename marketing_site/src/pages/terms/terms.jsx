import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";
import { BsFileEarmarkText } from "react-icons/bs";

export default function Terms() {
    return (
        <div className="bg-white text-[#171717] font-sans">
            <Head>
                <title>Terms & Conditions | MyPropertyPal</title>
                <meta name="description" content="Read the Terms & Conditions for using MyPropertyPal. We believe in privacy, transparency, and respectful software." />
                <meta property="og:title" content="Terms & Conditions | MyPropertyPal" />
                <meta property="og:description" content="Read the Terms & Conditions for using MyPropertyPal. We believe in privacy, transparency, and respectful software." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/LogoWB.png" />
                <link rel="icon" href="/LogoWB.png" />
                {/* Prevent robots from crawling this page */}
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            {/* Responsive Header */}
            <div className="hidden md:block">
                <Header />
            </div>
            <div className="block md:hidden">
                <MobileHeader />
            </div>

            {/* Hero Section */}
            <section className="max-w-3xl mx-auto text-center py-16 px-4 flex flex-col items-center">
                <BsFileEarmarkText size={56} className="text-[#2563eb] mb-4" />
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#2563eb]">
                    Terms &amp; Conditions
                </h1>
                <div className="text-gray-500 mb-2 text-base">
                    Effective Date: <span className="font-semibold">18/07/2025</span>
                </div>
                <p className="text-lg text-gray-700 max-w-xl mx-auto">
                    Welcome to MyPropertyPal (“we”, “us”, or “our”). By using our services, website, or app, you agree to these Terms &amp; Conditions. Please read them carefully.
                </p>
            </section>

            {/* Terms Content */}
            <section className="max-w-2xl mx-auto py-8 px-4">
                <ol className="space-y-8 text-base">
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">1. Who We Are</h2>
                        <p>
                            We're a small team, building software for landlords and tenants to simplify property management, digital tax submissions, and communication — without the bloat or surveillance.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">2. What You’re Agreeing To</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You’ll use the app responsibly and legally.</li>
                            <li>You won’t try to break, hack, or misuse the service.</li>
                            <li>You understand this is software, not legal or tax advice.</li>
                            <li>You’re responsible for the accuracy of any information you submit (e.g. VAT returns).</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">3. HMRC Access</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You’re authorizing us to access your tax information through HMRC’s Making Tax Digital API.</li>
                            <li>We only access what’s needed to help you submit returns or retrieve obligations.</li>
                            <li>You can revoke access at any time via HMRC or within your account settings.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">4. Privacy &amp; Tracking</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We do not use cookies.</li>
                            <li>We do not track you, run analytics scripts, or use ad pixels.</li>
                            <li>We only store what we need to help you use the service — and never sell your data.</li>
                            <li>You can read more in our Privacy Policy.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">5. Payments</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You agree to pay the listed subscription or one-time fee.</li>
                            <li>Payments are processed via Stripe. We don’t store your card info.</li>
                            <li>You can cancel at any time — access will remain until your billing period ends.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">6. Availability</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We aim for 99.9% uptime, but sometimes things go wrong. We’re not liable for outages or lost data.</li>
                            <li>You use the service “as is”, without any guarantees or warranties.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">7. Termination</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We reserve the right to suspend or terminate your account if you violate these terms or misuse the platform (e.g. submit false information, attempt fraud).</li>
                            <li>You can delete your account anytime by emailing us or via the app.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">8. Changes to These Terms</h2>
                        <p>
                            We may update these Terms from time to time. If we do, we’ll post the new version here and notify you via email or in-app.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">9. Contact Us</h2>
                        <p>
                            Questions? Concerns? <br />
                            Reach out to our CEO directly: <a href="mailto:Tommy.Rowe.Dev@gmail.com" className="underline text-[#2563eb]">Tommy.Rowe.Dev@gmail.com</a>
                        </p>
                    </li>
                </ol>
                <div className="mt-12 text-center text-lg text-[#2563eb] font-semibold flex flex-col items-center">
                    <span className="text-2xl mb-2">🚫</span>
                    No weird tracking. No surveillance. Just software that respects your time and data.
                </div>
            </section>

            <Footer />
        </div>
    );
}