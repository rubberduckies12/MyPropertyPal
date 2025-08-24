import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function TaxDeductions() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>Landlord Tax Deductions Explained: Save Money With Smarter Tracking | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn how landlords can save money with smarter expense tracking. Discover allowable tax deductions and how MyPropertyPal simplifies landlord accounting."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Landlord Tax Deductions Explained: Save Money With Smarter Tracking | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover how landlords can maximise tax savings with MyPropertyPal. Learn about allowable deductions and smarter expense tracking."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landlord Tax Deductions Explained: Save Money With Smarter Tracking | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover how landlords can maximise tax savings with MyPropertyPal. Learn about allowable deductions and smarter expense tracking."
        />
        <meta name="twitter:image" content="/LogoWB.png" />
        <link rel="icon" href="/LogoWB.png" />
      </Head>

      {/* Headers */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto py-16 px-6 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold text-[#2563eb] mb-8 text-center leading-tight">
          Landlord Tax Deductions Explained: Save Money With Smarter Tracking
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Being a landlord comes with plenty of responsibilities — from managing tenants to keeping up with compliance. But one of the biggest challenges? Staying on top of tax deductions.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Every year, landlords across the UK miss out on hundreds — sometimes thousands — of pounds in savings simply because they don’t track their expenses properly. With HMRC’s Making Tax Digital (MTD) rules approaching, keeping clear, accurate records isn’t just smart — it’s essential.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Tax Deductions Can Landlords Claim?</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Here are the most common allowable expenses landlords should be tracking:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Mortgage interest (restricted under Section 24, but still claimable as a basic-rate tax credit)</li>
          <li>Repairs and maintenance (fixing a broken boiler, repainting, replacing carpets)</li>
          <li>Insurance costs (landlord insurance, buildings insurance)</li>
          <li>Utilities and council tax (if you cover them instead of the tenant)</li>
          <li>Letting agent or property management fees</li>
          <li>Accountancy or legal fees (related to property management)</li>
          <li>Travel expenses (if you visit your rental property for management purposes)</li>
          <li>Advertising for new tenants (online listings, marketing costs)</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Landlords Miss Out on Deductions</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Paper receipts get lost or fade over time</li>
          <li>Expenses aren’t categorised properly until the tax return deadline</li>
          <li>Mixing personal and rental costs leads to confusion and missed claims</li>
          <li>Reactive accounting means you only think about expenses at year-end</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Missing even a handful of receipts each year can add up to a serious loss in tax savings.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps Landlords Track Deductions</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Financial Manager:</strong> Track rental income & expenses in real time — no more year-end surprises. Flexible rent schedules, AI-powered invoice & receipt scanning, and clear cash flow views.
          </li>
          <li>
            <strong>Documents in One Place:</strong> Store contracts, compliance certificates, and receipts securely. Everything is easy to find when HMRC or your accountant needs proof.
          </li>
          <li>
            <strong>Compliance Reminders:</strong> Stay ahead of gas safety checks, EPCs, and other legal requirements — avoiding costly penalties that could eat into your tax savings.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Smarter Tracking = Bigger Savings</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The key to saving money on landlord tax is consistent tracking. By digitising your property finances, you’ll:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Always have accurate records</li>
          <li>Capture every allowable deduction</li>
          <li>Reduce stress at tax return deadlines</li>
          <li>Be fully prepared for HMRC’s Making Tax Digital rollout</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Keep More of Your Rental Income?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — the all-in-one platform built for real landlords, making rent, compliance, and tax effortless.
        </p>

        {/* Join MyPropertyPal Button */}
        <div className="text-center mt-12">
          <a
            href="https://app.mypropertypal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full px-10 py-4 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Join MyPropertyPal Now
          </a>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}