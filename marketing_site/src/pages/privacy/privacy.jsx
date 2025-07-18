import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";
import { BsShieldLock } from "react-icons/bs";

export default function Privacy() {
    return (
        <div className="bg-white text-[#171717] font-sans">
            <Head>
                <title>Privacy Policy | MyPropertyPal</title>
                <meta name="description" content="Read the Privacy Policy for MyPropertyPal. We respect your privacy: no tracking, no cookies, no data selling." />
                <meta property="og:title" content="Privacy Policy | MyPropertyPal" />
                <meta property="og:description" content="Read the Privacy Policy for MyPropertyPal. We respect your privacy: no tracking, no cookies, no data selling." />
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
                <BsShieldLock size={56} className="text-[#2563eb] mb-4" />
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#2563eb]">
                    Privacy Policy
                </h1>
                <div className="text-gray-500 mb-2 text-base">
                    Effective Date: <span className="font-semibold">18/07/2025</span>
                </div>
                <p className="text-lg text-gray-700 max-w-xl mx-auto">
                    At MyPropertyPal, your privacy isn’t just a legal checkbox — it’s a principle. We don’t track you, we don’t sell your data, and we keep things simple and respectful.
                </p>
            </section>

            {/* Privacy Content */}
            <section className="max-w-2xl mx-auto py-8 px-4">
                <ol className="space-y-8 text-base">
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">1. What We Collect</h2>
                        <p>We only collect the data we need to provide our service. That includes:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Account details: name, email, password (hashed)</li>
                            <li>Property &amp; tenant data: the information you input into the app</li>
                            <li>Tax data: if you connect to HMRC, we retrieve your obligations and submissions via their secure API</li>
                            <li>App usage info: what features you use (stored anonymously, no analytics scripts)</li>
                        </ul>
                        <div className="mt-4">
                            <span className="font-semibold">We do not use:</span>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Tracking cookies</li>
                                <li>Ad pixels</li>
                                <li>Third-party analytics</li>
                                <li>Fingerprinting or session recording tools</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide the app and its core features</li>
                            <li>Connect to HMRC on your behalf (only when you authorize it)</li>
                            <li>Send necessary service updates (e.g. tax submission confirmation)</li>
                            <li>Improve the product (anonymously — no creepy tracking)</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">3. How We Store It</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your data is stored securely in our backend database</li>
                            <li>Passwords are hashed (not stored in plain text)</li>
                            <li>HMRC tokens are stored securely and never exposed to the frontend</li>
                            <li>We do not store payment information — that’s handled by Stripe</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">4. HMRC Access</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>If you authorize HMRC access:</li>
                            <ul className="list-disc pl-10 space-y-1 mt-2">
                                <li>We store your access_token and refresh_token securely</li>
                                <li>These are used only to retrieve obligations and submit VAT returns (when you initiate it)</li>
                                <li>You can revoke access at any time via your HMRC account or in the app</li>
                            </ul>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">5. Sharing &amp; Disclosure</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We do not sell or share your data with third parties — ever.</li>
                            <li>We may only disclose data if required by law or to protect our service from abuse.</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">6. Your Rights</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Request a copy of your data</li>
                            <li>Ask us to delete your account and data permanently</li>
                            <li>Revoke HMRC access</li>
                            <li>Cancel your subscription at any time</li>
                        </ul>
                        <p className="mt-2">
                            To do any of the above, just email us at <a href="mailto:Tommy.Rowe.Dev@gmail.com" className="underline text-[#2563eb]">Tommy.Rowe.Dev@gmail.com</a> or use the in-app settings.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">7. Cookies</h2>
                        <p className="mb-2">🍪 We don’t use them.</p>
                        <p>
                            There are no cookies on our site or app. No popups, no consent boxes, no trackers — just clean software.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">8. Third-Party Services</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Stripe for payments</li>
                            <li>HMRC API (when you connect)</li>
                            <li>OpenAI API for our AI Chatbot (when you use the chatbot feature)</li>
                            <li>Google APIs for document scanning and contractor finding (when you use those features)</li>
                        </ul>
                        <p className="mt-2">
                            We never use ad networks or analytics companies.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">9. Security</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Encrypted HTTPS connections</li>
                            <li>Hashed passwords</li>
                            <li>Secure token storage</li>
                            <li>Regular audits and internal reviews</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">10. Changes</h2>
                        <p>
                            We’ll update this page if anything changes. If the changes are significant, we’ll notify you via email or in the app.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-xl font-bold text-[#2563eb] mb-2">11. Contact</h2>
                        <p>
                            Questions about privacy? <br />
                            Email our CEO directly: <a href="mailto:Tommy.Rowe.Dev@gmail.com" className="underline text-[#2563eb]">Tommy.Rowe.Dev@gmail.com</a>
                        </p>
                    </li>
                </ol>
                <div className="mt-12 text-center text-lg text-[#2563eb] font-semibold flex flex-col items-center">
                    <span className="text-2xl mb-2">🔒</span>
                    No weird tracking. No cookies. Just clean, respectful software.
                </div>
            </section>

            <Footer />
        </div>
    );
}