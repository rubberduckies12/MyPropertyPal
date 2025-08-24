import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function TaxInLessThan1Hours() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>How to Prepare Your Property Accounts for HMRC in Under an Hour | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn how to prepare your property accounts for HMRC in under an hour with MyPropertyPal. Simplify landlord accounting with our digital property management tools."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="How to Prepare Your Property Accounts for HMRC in Under an Hour | MyPropertyPal" />
        <meta
          property="og:description"
          content="Simplify landlord accounting with MyPropertyPal. Learn how to prepare your property accounts for HMRC quickly and stress-free."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Prepare Your Property Accounts for HMRC in Under an Hour | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Simplify landlord accounting with MyPropertyPal. Learn how to prepare your property accounts for HMRC quickly and stress-free."
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
          How to Prepare Your Property Accounts for HMRC in Under an Hour
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Preparing landlord accounts for HMRC can feel overwhelming — spreadsheets, receipts, late rent payments, compliance checks, and Making Tax Digital (MTD) on the horizon. Many small landlords find themselves scrambling at the end of the tax year, only to discover they’ve missed deductible expenses or important records.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The good news? With the right system, you can keep everything organised throughout the year and prepare your property accounts for HMRC in less than an hour.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Landlord Accounting is a Headache</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Scattered records: Rent payments, invoices, and expenses often live across emails, paper receipts, and bank statements.</li>
          <li>Tax complexity: HMRC’s MTD rules mean landlords will soon need digital records and quarterly submissions.</li>
          <li>Time pressure: Without real-time tracking, accounts become a last-minute stress every January.</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          These challenges cost landlords both time and money. That’s where smart property management software can make all the difference.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">A Faster Way: Digital Property Management</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Instead of chasing receipts and reconciling accounts manually, digital property management tools centralise your data. Everything — rent schedules, expenses, tenant communications, and compliance reminders — sits in one place, ready to export when you need it.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Simplifies HMRC Preparation</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard Overview:</strong> See your entire portfolio at a glance — rent received, upcoming payments, maintenance costs, and compliance deadlines. No need to cross-check multiple spreadsheets.
          </li>
          <li>
            <strong>Financial Manager:</strong> Income & expenses tracked automatically, flexible rent schedules, AI-powered invoice/receipt scanning, and clear cash flow views.
          </li>
          <li>
            <strong>Secure Document Storage:</strong> Store tenancy agreements, compliance certificates, and invoices in one secure hub. When HMRC requires proof, it’s just a click away.
          </li>
          <li>
            <strong>Compliance & Legal Tracking:</strong> Never miss a gas safety check or EPC renewal. Automated reminders keep your properties legally compliant — and your accounts accurate.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Preparing Your HMRC Property Accounts in Under an Hour</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Here’s how it works with MyPropertyPal:
        </p>
        <ol className="list-decimal list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Log into your dashboard – instantly see rent payments, outstanding balances, and expenses.</li>
          <li>Review expenses – scanned and categorised automatically with our AI receipt tool.</li>
          <li>Export data – download your income/expense summary, ready to share with your accountant or HMRC.</li>
          <li>Double-check compliance reminders – all documents are already organised securely.</li>
        </ol>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          That’s it — no endless paper chasing, no lost receipts, no last-minute panic.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Now? HMRC’s Making Tax Digital is Coming</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          From April 2026, all landlords with property income over £50,000 will need to keep digital records and submit quarterly updates to HMRC. Preparing now with a tool like MyPropertyPal ensures you’re ready — without adding extra work.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Future of Property Management (Built for Landlords Like You)</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          MyPropertyPal was built alongside real landlords to remove the pain of managing properties. Whether you own one buy-to-let or a growing portfolio, our platform brings everything — finances, tenants, compliance, and communication — into one simple, secure system.
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