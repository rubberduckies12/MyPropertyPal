import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function SevenMistakes() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>The 7 Biggest Mistakes New Landlords Make (And How to Avoid Them) | MyPropertyPal</title>
        <meta
          name="description"
          content="Discover the 7 biggest mistakes new landlords make and learn how to avoid them. MyPropertyPal simplifies property management for landlords."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The 7 Biggest Mistakes New Landlords Make (And How to Avoid Them) | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover the 7 biggest mistakes new landlords make and learn how to avoid them. MyPropertyPal simplifies property management for landlords."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The 7 Biggest Mistakes New Landlords Make (And How to Avoid Them) | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover the 7 biggest mistakes new landlords make and learn how to avoid them. MyPropertyPal simplifies property management for landlords."
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
          The 7 Biggest Mistakes New Landlords Make (And How to Avoid Them)
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Becoming a landlord can be rewarding, but it comes with challenges that first-time landlords often underestimate. From tenant issues to tax headaches, small mistakes can quickly eat into your rental profits.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Here are seven of the most common mistakes new landlords make — and how to avoid them.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">1. Not Screening Tenants Properly</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Choosing the wrong tenant can lead to late rent, property damage, or disputes. Many new landlords rush this step and pay the price later.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Take time to check references, verify income, and use a clear tenancy agreement.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">2. Ignoring Legal Compliance</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Landlords must meet strict requirements for gas safety, EPCs, and other regulations. Missing deadlines can result in fines.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Use reminders and tracking tools to stay on top of compliance. MyPropertyPal’s legal manager helps landlords monitor deadlines automatically.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">3. Poor Record Keeping</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Receipts in shoeboxes and income spread across multiple bank accounts make tax season stressful. Many landlords lose money by missing allowable expenses.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Track income and expenses throughout the year. MyPropertyPal’s financial manager and AI-powered receipt scanning make this simple.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">4. Underestimating Maintenance Costs</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Repairs and upkeep are part of being a landlord. Ignoring maintenance can make problems worse and drive tenants away.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Budget realistically and respond to issues quickly. With MyPropertyPal, tenants can submit maintenance requests directly, helping you act fast.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">5. Failing to Communicate with Tenants</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Poor communication often leads to misunderstandings and disputes. Landlords who don’t provide tenants with an easy way to get in touch risk damaging relationships.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Use a system that keeps all communication in one place. MyPropertyPal’s tenant portal and messaging system make this simple and secure.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">6. Not Planning for Taxes</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Many new landlords don’t think about tax until the deadline looms. With Making Tax Digital on the way, last-minute paperwork won’t cut it.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Keep records digitally and stay prepared. MyPropertyPal helps landlords keep everything organised for HMRC.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">7. Trying to Manage Everything Manually</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Spreadsheets, paper receipts, and phone calls might work for one property — but they won’t scale as your portfolio grows.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          <strong>Avoid it:</strong> Use property management software to streamline admin and save time. MyPropertyPal was designed for landlords to manage tenants, finances, and compliance all in one place.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Avoiding Mistakes = Protecting Profits</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The best landlords are proactive, not reactive. By avoiding these common mistakes, you’ll protect your investment, keep tenants happy, and reduce stress.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Manage Your Rentals the Smart Way?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — everything you and your tenants need, in one secure, easy-to-use platform.
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