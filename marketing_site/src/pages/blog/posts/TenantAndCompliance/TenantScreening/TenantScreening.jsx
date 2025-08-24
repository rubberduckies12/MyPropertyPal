import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function TenantsScreening() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>How to Screen Tenants Properly (Without Breaking the Law) | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn how landlords can screen tenants effectively while staying compliant with legal guidelines. Discover how MyPropertyPal simplifies tenant screening."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="How to Screen Tenants Properly (Without Breaking the Law) | MyPropertyPal" />
        <meta
          property="og:description"
          content="Learn how landlords can screen tenants effectively while staying compliant with legal guidelines. Discover how MyPropertyPal simplifies tenant screening."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Screen Tenants Properly (Without Breaking the Law) | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Learn how landlords can screen tenants effectively while staying compliant with legal guidelines. Discover how MyPropertyPal simplifies tenant screening."
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
          How to Screen Tenants Properly (Without Breaking the Law)
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Finding the right tenant is one of the most important responsibilities a landlord has. A reliable tenant pays rent on time, respects the property, and follows the tenancy agreement. But screening tenants comes with legal obligations — getting it wrong can lead to discrimination claims or other legal issues.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This guide shows how to screen tenants effectively while staying fully compliant.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Step 1: Create Clear, Fair Criteria</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Before advertising your property, define what makes a good tenant. Focus on objective factors, such as:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Ability to pay rent (income or employment verification)</li>
          <li>Rental history and references</li>
          <li>Agreement to your tenancy terms</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Avoid any criteria based on race, religion, gender, age, or other protected characteristics. Clear, consistent criteria protect you from legal claims.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Step 2: Request References</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          References are a key part of tenant screening:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Previous landlords: Confirm timely rent payments and property care</li>
          <li>Employer or income verification: Ensure they can meet the rent obligations</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Document all references for your records, and treat all applicants equally to stay compliant.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Step 3: Conduct Credit and Background Checks</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Credit checks give insight into financial responsibility, while background checks help ensure tenants are trustworthy. Always get written consent before running checks, and use reputable screening services.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Step 4: Use Written Agreements</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          A clear tenancy agreement sets expectations from the start. Include details about:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Rent amount and payment schedule</li>
          <li>Maintenance responsibilities</li>
          <li>Rules regarding pets, smoking, or subletting</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This not only protects you legally but also helps tenants understand their obligations.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Step 5: Keep Records Securely</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          All tenant applications, references, and agreements should be stored securely and confidentially. This protects both your tenants’ privacy and your own legal position.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Helps Landlords Screen Tenants</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Tenant Records:</strong> Store applications, references, and agreements in one secure location.
          </li>
          <li>
            <strong>Dashboard Overview:</strong> Track tenants and properties in a single view.
          </li>
          <li>
            <strong>Document Management:</strong> Keep all supporting documents safely stored and easy to access.
          </li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          By centralising tenant information, landlords can screen applicants thoroughly, stay compliant with the law, and reduce the risk of disputes.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Conclusion: Screen Carefully, Stay Compliant</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Effective tenant screening protects your rental income and ensures a smooth tenancy. By following legal guidelines and keeping records organised, landlords can select the right tenants while avoiding legal pitfalls.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Make Tenant Management Simple?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — everything you need to manage tenants, properties, and compliance in one secure platform.
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