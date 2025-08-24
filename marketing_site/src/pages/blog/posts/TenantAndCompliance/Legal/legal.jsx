import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function LegalResponsibilities() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>Landlords’ Legal Responsibilities in 2025 | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn about landlords' legal responsibilities in 2025, including gas safety, EPCs, and deposit protection. Discover how MyPropertyPal simplifies compliance."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Landlords’ Legal Responsibilities in 2025 | MyPropertyPal" />
        <meta
          property="og:description"
          content="Learn about landlords' legal responsibilities in 2025, including gas safety, EPCs, and deposit protection. Discover how MyPropertyPal simplifies compliance."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landlords’ Legal Responsibilities in 2025 | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Learn about landlords' legal responsibilities in 2025, including gas safety, EPCs, and deposit protection. Discover how MyPropertyPal simplifies compliance."
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
          Landlords’ Legal Responsibilities in 2025
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Being a landlord isn’t just about collecting rent — it also comes with a range of legal responsibilities. Staying compliant protects your tenants, your properties, and your income. With changes in regulations and Making Tax Digital (MTD) coming in 2026, keeping track of all legal obligations has never been more important.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Here’s what landlords need to know in 2025 and how MyPropertyPal can help.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Key Legal Responsibilities for Landlords</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Gas Safety Certificates:</strong> Landlords must ensure that all gas appliances are checked annually by a registered engineer. Certificates need to be issued and kept on file.
          </li>
          <li>
            <strong>Electrical Safety Checks:</strong> From July 2020, landlords in England must have the electrical installations in their properties inspected and tested every five years.
          </li>
          <li>
            <strong>Energy Performance Certificates (EPCs):</strong> Properties must have a valid EPC when rented out, showing the energy efficiency rating.
          </li>
          <li>
            <strong>Deposit Protection:</strong> Tenants’ deposits must be protected in a government-approved tenancy deposit scheme.
          </li>
          <li>
            <strong>Right to Rent Checks:</strong> Landlords must verify that tenants have the legal right to rent in the UK.
          </li>
          <li>
            <strong>Fire and Smoke Safety:</strong> Install smoke alarms on every floor and carbon monoxide alarms where required, and carry out regular checks.
          </li>
          <li>
            <strong>Reporting Changes and Compliance Deadlines:</strong> HMRC and local authorities may require records of rental income, tax deductions, and compliance documents, especially with MTD approaching.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps Landlords Stay Compliant</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard:</strong> See all your properties and tenants in one view, including upcoming compliance deadlines.
          </li>
          <li>
            <strong>Legal Manager:</strong> Track gas safety, EPCs, and other mandatory checks. Receive automated reminders before certificates expire and keep all compliance records secure and accessible.
          </li>
          <li>
            <strong>Document Management:</strong> Store safety certificates, tenancy agreements, and inspection reports in one place. Access them quickly when needed, for HMRC submissions or inspections.
          </li>
          <li>
            <strong>AI Chatbot & Messages:</strong> Get instant answers to questions about property compliance or legal obligations. Communicate with tenants and contractors directly within the platform.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Staying Compliant Matters</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Failure to meet legal obligations can result in fines, legal action, and loss of rental income. By staying organised and keeping accurate records, you protect your tenants, your investment, and your business.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Take Control of Your Landlord Responsibilities</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — everything you need to manage tenants, properties, and legal compliance in one secure, easy-to-use platform.
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