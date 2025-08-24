import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function TrackRent() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>How to Easily Track Rent Payments Without Spreadsheets | MyPropertyPal</title>
        <meta
          name="description"
          content="Discover how landlords can track rent payments without spreadsheets. Learn how MyPropertyPal simplifies rent tracking and portfolio management."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="How to Easily Track Rent Payments Without Spreadsheets | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover how landlords can track rent payments without spreadsheets. Learn how MyPropertyPal simplifies rent tracking and portfolio management."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Easily Track Rent Payments Without Spreadsheets | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover how landlords can track rent payments without spreadsheets. Learn how MyPropertyPal simplifies rent tracking and portfolio management."
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
          How to Easily Track Rent Payments Without Spreadsheets
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          For many landlords, spreadsheets are the go-to tool for managing rent payments. They’re simple, familiar, and free. But as soon as you take on more than one property — or even just one tricky tenant — spreadsheets start to show their limits.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Late payments get lost in endless rows of data. Formulas break. Receipts sit in another folder entirely. Before long, you’re spending more time updating a sheet than actually managing your properties.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          So, how can you track rent payments in a way that’s simple, reliable, and stress-free?
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Problem With Spreadsheets</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Manual updates – Every payment has to be entered by hand, leaving room for error.</li>
          <li>No reminders – If rent is late, you won’t know until you check your sheet.</li>
          <li>Scattered data – Receipts, invoices, and tenant communications end up outside the spreadsheet.</li>
          <li>Limited visibility – Spreadsheets can’t give you a clear, real-time view of your portfolio.</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          What seems like a quick solution at first soon turns into a constant admin burden.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Smarter Ways to Track Rent</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Instead of relying on spreadsheets, landlords are turning to property management tools that automate the process:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Automatic rent tracking – Log payments as they come in, linked directly to each tenant.</li>
          <li>Flexible rent schedules – Track weekly, monthly, or custom payment terms.</li>
          <li>Clear records – Store all payment history securely in one place.</li>
          <li>Integration with expenses – Combine income and outgoings for a full financial picture.</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This means less chasing, fewer mistakes, and a much clearer view of your cash flow.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Makes Rent Tracking Simple</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard:</strong> See which tenants have paid, which are late, and what’s due — all at a glance.
          </li>
          <li>
            <strong>Flexible Rent Schedules:</strong> Set up custom payment terms to match your tenancy agreements, whether weekly, monthly, or otherwise.
          </li>
          <li>
            <strong>Payment History:</strong> Keep a complete record of all payments linked directly to each tenant and property.
          </li>
          <li>
            <strong>Financial Manager:</strong> Track rent alongside expenses, giving you a real-time overview of your portfolio’s cash flow.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Conclusion: Leave Spreadsheets Behind</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Spreadsheets may have worked when you started, but they can’t keep up with the realities of property management. By switching to a purpose-built tool like MyPropertyPal, you can save hours of admin, reduce errors, and keep your finances in order.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Make Rent Tracking Easy?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — everything you need to manage tenants, payments, and finances, all in one place.
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