import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function EPCRegulations() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>What Landlords Need to Know About EPC Regulations | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn about EPC regulations for landlords, including legal requirements, MEES standards, and compliance deadlines. Discover how MyPropertyPal simplifies EPC tracking."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="What Landlords Need to Know About EPC Regulations | MyPropertyPal" />
        <meta
          property="og:description"
          content="Learn about EPC regulations for landlords, including legal requirements, MEES standards, and compliance deadlines. Discover how MyPropertyPal simplifies EPC tracking."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What Landlords Need to Know About EPC Regulations | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Learn about EPC regulations for landlords, including legal requirements, MEES standards, and compliance deadlines. Discover how MyPropertyPal simplifies EPC tracking."
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
          What Landlords Need to Know About EPC Regulations
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Energy Performance Certificates (EPCs) are a key legal requirement for landlords. They show how energy-efficient a property is and are required whenever a property is rented or sold. Understanding EPC regulations is crucial to avoid fines and ensure your rental properties comply with the law.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Is an EPC?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          An EPC provides:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>A rating from A (most efficient) to G (least efficient)</li>
          <li>Recommendations for improving energy efficiency</li>
          <li>Estimated energy costs</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Tenants can view the EPC before renting, and it forms part of your legal obligations as a landlord.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">EPC Requirements for Landlords</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Valid Certificate:</strong> Every rental property must have a valid EPC. Certificates are valid for 10 years, but must be renewed if any major energy-related improvements are made.
          </li>
          <li>
            <strong>Minimum Energy Efficiency Standards (MEES):</strong> Properties rented in the private sector must meet a minimum rating of E. Landlords cannot legally rent out properties rated F or G unless an exemption applies.
          </li>
          <li>
            <strong>Display and Provision:</strong> Provide a copy to tenants at the start of the tenancy and include the EPC rating in marketing materials for new rentals.
          </li>
          <li>
            <strong>Record-Keeping and Compliance:</strong> Landlords must keep records of EPCs and ensure compliance with deadlines to avoid penalties. Non-compliance can result in fines of up to £5,000 per property.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps Landlords Stay EPC-Compliant</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard Overview:</strong> See all your properties and their EPC status at a glance, including expiry dates.
          </li>
          <li>
            <strong>Legal Manager:</strong> Automated reminders for when EPCs are due or expiring. Keep certificates stored securely for quick access.
          </li>
          <li>
            <strong>Document Management:</strong> Store copies of EPCs alongside other compliance documents, making inspections and HMRC reporting straightforward.
          </li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          By centralising EPC tracking, landlords can avoid fines, stay compliant, and ensure tenants have the information they need.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why EPC Compliance Matters</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          EPC compliance isn’t just a legal requirement — it also improves tenant satisfaction and can make your properties more attractive in the rental market. Staying on top of your EPCs is a small step that protects your investment and keeps your rentals legal.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Take the Stress Out of Compliance</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — track EPCs, rent, tenants, and all legal obligations in one simple, secure platform.
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