import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function CompleteGuide() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>The Complete Guide to Managing Multiple Properties as a Small Landlord | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn how small landlords can stay organised and profitable while managing multiple properties. Discover how MyPropertyPal simplifies multi-property management."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Complete Guide to Managing Multiple Properties as a Small Landlord | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover how small landlords can stay organised and profitable while managing multiple properties with MyPropertyPal."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Complete Guide to Managing Multiple Properties as a Small Landlord | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover how small landlords can stay organised and profitable while managing multiple properties with MyPropertyPal."
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
          The Complete Guide to Managing Multiple Properties as a Small Landlord
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Managing one rental property is challenging enough — but when you take on two, three, or more, the workload multiplies quickly. Rent collection, tenant communication, maintenance, and compliance deadlines can easily spiral out of control if you don’t have a system in place.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This guide explains how small landlords can stay organised and profitable while managing multiple properties.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Challenges of Managing Multiple Properties</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Missed rent payments if you’re tracking income manually</li>
          <li>Overlapping maintenance requests from different tenants</li>
          <li>Lost receipts or documents scattered across files and folders</li>
          <li>Compliance deadlines that are easy to forget but costly to miss</li>
          <li>Tenant communication issues if messages come through multiple channels</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Without structure, the stress of managing more than one property can outweigh the benefits.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Key Principles for Small Landlords</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Stay Organised with One System:</strong> Using separate spreadsheets, paper files, and texts might work with a single property — but not with several. Bringing everything into one place is essential.
          </li>
          <li>
            <strong>Track Finances in Real Time:</strong> Multiple properties mean multiple income streams and expenses. Real-time tracking ensures you know exactly where your cash flow stands.
          </li>
          <li>
            <strong>Standardise Communication:</strong> Tenants expect quick responses. Having all messages in one secure platform avoids confusion and missed updates.
          </li>
          <li>
            <strong>Stay Ahead of Compliance:</strong> Gas safety certificates, EPC renewals, and other legal requirements multiply with each property. Missed deadlines can lead to fines or legal issues.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps Small Landlords</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard:</strong> See an overview of your entire rental portfolio in one place — from rent received to compliance deadlines.
          </li>
          <li>
            <strong>Property Manager:</strong> Manage multiple properties and tenants in one hub. Receive and track maintenance requests, and search for local contractors when repairs are needed.
          </li>
          <li>
            <strong>Financial Manager:</strong> Monitor rental income across all properties. Set flexible rent schedules for different tenants, and scan and categorise invoices/receipts automatically, keeping your records tax-ready.
          </li>
          <li>
            <strong>Tenant Portal:</strong> Tenants can log maintenance requests directly, share important documents securely, and provide a clear record of rent payments and communication.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Systems Matter for Growth</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Managing multiple properties without the right tools leads to stress, errors, and missed opportunities. By using one central platform, landlords can:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Save time on admin</li>
          <li>Reduce the risk of compliance fines</li>
          <li>Capture every deductible expense</li>
          <li>Keep tenants happier with faster responses</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Simplify Multi-Property Management?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — the all-in-one platform designed to help landlords manage multiple properties with ease.
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