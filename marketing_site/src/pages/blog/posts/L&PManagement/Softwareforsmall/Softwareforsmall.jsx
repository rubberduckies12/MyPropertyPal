import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function SoftwareForSmall() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>Is Property Management Software Worth It for Small Portfolios? | MyPropertyPal</title>
        <meta
          name="description"
          content="Discover why property management software is worth it for small landlords. Learn how MyPropertyPal simplifies rent, compliance, and tenant management."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Is Property Management Software Worth It for Small Portfolios? | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover why property management software is worth it for small landlords. Learn how MyPropertyPal simplifies rent, compliance, and tenant management."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Is Property Management Software Worth It for Small Portfolios? | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover why property management software is worth it for small landlords. Learn how MyPropertyPal simplifies rent, compliance, and tenant management."
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
          Is Property Management Software Worth It for Small Portfolios?
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          If you own just one or two rental properties, you might wonder whether property management software is overkill. After all, isn’t it cheaper and easier to manage things with a spreadsheet, some receipts in a folder, and the occasional email?
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          It’s a fair question — but the truth is, even small landlords face the same challenges as larger portfolio owners: late rent, misplaced receipts, tenant communication issues, and compliance deadlines. The difference is that without the right systems, those problems fall entirely on you.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          So, is property management software worth it if you only have a small portfolio? Let’s find out.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Challenges Small Portfolio Landlords Face</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Rent collection – tracking who has paid, who hasn’t, and when rent is due</li>
          <li>Expenses – keeping hold of receipts and remembering what’s tax-deductible</li>
          <li>Maintenance – logging requests, finding contractors, and keeping tenants happy</li>
          <li>Compliance – staying on top of gas safety, EPCs, and legal requirements</li>
          <li>Communication – ensuring tenants and contractors can reach you easily</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Without proper organisation, these tasks eat into your time and reduce your returns.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Case for Property Management Software</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Property management software brings structure to all of the above. It helps landlords:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Centralise all property data in one place</li>
          <li>Track rent payments automatically</li>
          <li>Store and organise receipts for tax purposes</li>
          <li>Keep a record of tenant communication</li>
          <li>Stay compliant with reminders for legal deadlines</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          What once took hours of admin work can be reduced to a few clicks.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why Small Portfolios Benefit Most</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Many landlords assume software is only for large portfolios. In reality, it’s often landlords with smaller portfolios who benefit the most:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>You don’t have staff or agents to handle admin for you</li>
          <li>Every missed expense or late rent payment has a bigger impact</li>
          <li>The time saved can be put back into growing your portfolio or simply reducing stress</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How MyPropertyPal Fits Small Landlords</h2>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Dashboard:</strong> Get an overview of your entire portfolio in one place, no matter how many properties you own.
          </li>
          <li>
            <strong>Property Manager:</strong> Keep track of tenants, properties, and maintenance requests without juggling spreadsheets.
          </li>
          <li>
            <strong>Financial Manager:</strong> Flexible rent schedules for different tenants, real-time tracking of income and expenses, and AI-powered receipt scanning and categorisation for tax purposes.
          </li>
          <li>
            <strong>Compliance Tracking:</strong> Automated reminders keep you ahead of legal obligations, so nothing slips through the cracks.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Conclusion: Yes, It’s Worth It</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Even if you only manage a handful of properties, property management software pays for itself in time saved, expenses captured, and compliance risks avoided.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          MyPropertyPal was built to make life easier for landlords like you — giving you everything you need to manage tenants, finances, and compliance, all in one simple, secure platform.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Take Control of Your Portfolio?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — designed for small landlords who want to save time, reduce stress, and stay profitable.
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