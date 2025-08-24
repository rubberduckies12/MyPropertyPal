import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function MTD() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>Making Tax Digital for Landlords: What You Need to Know Before 2026 | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn how landlords can prepare for HMRC's Making Tax Digital (MTD) rules. Discover how MyPropertyPal simplifies digital record keeping and quarterly submissions."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Making Tax Digital for Landlords: What You Need to Know Before 2026 | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover how landlords can prepare for HMRC's Making Tax Digital (MTD) rules with MyPropertyPal. Simplify digital record keeping and quarterly submissions."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Making Tax Digital for Landlords: What You Need to Know Before 2026 | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover how landlords can prepare for HMRC's Making Tax Digital (MTD) rules with MyPropertyPal. Simplify digital record keeping and quarterly submissions."
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
          Making Tax Digital for Landlords: What You Need to Know Before 2026
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Landlord tax is about to change. From April 2026, HMRC will require many landlords to keep digital records and submit tax information every quarter under the Making Tax Digital (MTD) scheme.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          For landlords already juggling tenants, repairs, and compliance, this might sound like yet another layer of admin. But with the right system in place, MTD doesn’t have to be complicated.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Is Making Tax Digital (MTD)?</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          MTD is HMRC’s plan to modernise the tax system. Instead of one yearly self-assessment tax return, landlords will need to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Keep digital records of rental income and expenses</li>
          <li>Submit quarterly updates to HMRC through approved software</li>
          <li>Complete a final end-of-year declaration</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The rollout starts in April 2026 for landlords with income over £50,000, and will extend to those earning above £30,000 in 2027.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Does This Mean for Landlords?</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          In practice, it means no more last-minute paperwork or stacks of receipts. Landlords will need to get comfortable with:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Quarterly submissions instead of one annual tax return</li>
          <li>Digital record keeping (spreadsheets alone won’t be enough)</li>
          <li>MTD-compatible software to communicate with HMRC</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Failing to comply could result in fines or penalties, so it pays to get prepared early.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps You Stay Ahead</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Financial Manager:</strong> Track income and expenses automatically, use flexible rent schedules, and scan/categorise invoices and receipts with AI-powered tools — ensuring no expense is missed.
          </li>
          <li>
            <strong>Document Storage:</strong> All important rental documents, from contracts to receipts, are stored securely and ready for when HMRC requires evidence.
          </li>
          <li>
            <strong>Dashboard Overview:</strong> Instantly see rental income, expenses, and compliance deadlines — making quarterly submissions far less stressful.
          </li>
          <li>
            <strong>Compliance Tracking:</strong> Automated reminders for gas safety checks, EPCs, and other legal requirements mean fewer last-minute surprises.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Prepare Now?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          MTD may not arrive until 2026, but setting up digital record keeping today means:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Less stress when the rules take effect</li>
          <li>Accurate records all year round</li>
          <li>No risk of missing tax-deductible expenses</li>
          <li>A smoother transition to quarterly reporting</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Get MTD-Ready?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — the all-in-one platform that makes managing rent, compliance, and tax simple and secure.
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