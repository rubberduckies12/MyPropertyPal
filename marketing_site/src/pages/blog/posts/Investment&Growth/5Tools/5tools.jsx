import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function FiveTools() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>5 Property Management Tools Every Landlord Should Be Using | MyPropertyPal</title>
        <meta
          name="description"
          content="Discover five essential property management tools every landlord should be using. Learn how MyPropertyPal simplifies property management and tenant communication."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="5 Property Management Tools Every Landlord Should Be Using | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover five essential property management tools every landlord should be using. Learn how MyPropertyPal simplifies property management and tenant communication."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="5 Property Management Tools Every Landlord Should Be Using | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover five essential property management tools every landlord should be using. Learn how MyPropertyPal simplifies property management and tenant communication."
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
          5 Property Management Tools Every Landlord Should Be Using
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Successful landlords know that managing rental properties isn’t just about collecting rent — it’s about staying organised, compliant, and efficient. The right tools can save you hours of admin every month, reduce stress, and keep tenants happier.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Here are five essential tools built directly into MyPropertyPal to help landlords manage their properties with ease.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">1. Centralised Dashboard</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Instead of juggling spreadsheets and notes, landlords can view their entire portfolio in one place. MyPropertyPal’s dashboard shows rent received, upcoming payments, maintenance requests, and compliance reminders at a glance.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">2. Property & Tenant Manager</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Keep track of every property and tenant in one secure hub. With MyPropertyPal, you can:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Store key property details</li>
          <li>Record tenant information</li>
          <li>Manage maintenance requests efficiently</li>
          <li>Find contractors through the built-in search tool</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This makes scaling from one property to several simple and stress-free.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">3. Financial Manager</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Property finances can be messy without the right system. MyPropertyPal helps landlords stay on top of:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Rental income and due dates</li>
          <li>Customisable rent schedules (monthly, weekly, or custom)</li>
          <li>Scanning and categorising receipts/invoices automatically</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          By keeping everything organised, landlords can avoid missed payments and simplify tax season.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">4. Legal & Compliance Tracker</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Missing compliance deadlines can lead to fines. MyPropertyPal removes the guesswork with:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Automated reminders for gas safety, EPCs, and more</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Landlords can stay compliant without having to remember every date manually.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">5. Tenant Portal & Messaging</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Good communication reduces disputes and keeps tenants happy. With MyPropertyPal’s tenant portal, renters can:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Submit and track maintenance requests</li>
          <li>Access important documents like tenancy agreements and EPCs</li>
          <li>Communicate directly with landlords in one place</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          For landlords, this means clearer records, faster responses, and fewer missed messages.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why These Tools Matter</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Using scattered apps and spreadsheets creates confusion and missed opportunities. By having all five tools built into one platform, MyPropertyPal helps landlords save time, reduce risk, and stay organised — no matter the size of their portfolio.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Simplify Property Management Today</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up now for early access to the MyPropertyPal Beta Release — everything you and your tenants need, in one simple and secure platform.
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