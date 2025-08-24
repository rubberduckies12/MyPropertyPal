import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function UltimateGuide() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>The Ultimate Guide to Landlord Expenses: What You Can and Can’t Claim | MyPropertyPal</title>
        <meta
          name="description"
          content="Learn what expenses landlords can and can’t claim at tax time. Discover how MyPropertyPal simplifies expense tracking and compliance for landlords."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Ultimate Guide to Landlord Expenses: What You Can and Can’t Claim | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover what expenses landlords can claim to reduce taxable profit. Learn how MyPropertyPal simplifies expense tracking and compliance for landlords."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Ultimate Guide to Landlord Expenses: What You Can and Can’t Claim | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover what expenses landlords can claim to reduce taxable profit. Learn how MyPropertyPal simplifies expense tracking and compliance for landlords."
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
          The Ultimate Guide to Landlord Expenses: What You Can and Can’t Claim
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Running rental properties isn’t just about collecting rent. Landlords face ongoing costs, from repairs to insurance, and knowing what you can and can’t claim as expenses makes a big difference at tax time.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Many landlords lose out on hundreds of pounds each year because they fail to record their expenses properly. With Making Tax Digital (MTD) approaching in 2026, accurate record-keeping will soon become more than just good practice — it will be required.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Expenses Can Landlords Claim?</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          HMRC allows landlords to deduct a wide range of expenses from their rental income. These include:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Repairs and maintenance – fixing a broken boiler, replacing carpets, or repainting walls</li>
          <li>Insurance – landlord, buildings, or contents insurance</li>
          <li>Utilities and council tax – if the landlord pays instead of the tenant</li>
          <li>Letting agent or property management fees</li>
          <li>Accountancy and legal costs related to the rental business</li>
          <li>Travel expenses – mileage to and from your rental property</li>
          <li>Advertising costs – such as online listings when finding tenants</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Claiming these correctly reduces your taxable profit and lowers your bill.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">What Expenses Can’t Be Claimed?</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Some costs are not deductible against rental income:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Capital improvements – for example, adding an extension or upgrading to a new kitchen (though these may reduce capital gains tax when selling)</li>
          <li>Personal expenses – anything not directly linked to the rental property</li>
          <li>Mortgage capital repayments – only the interest portion is relevant for tax purposes</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Knowing the difference between allowable expenses and capital improvements is key to staying compliant and avoiding HMRC challenges.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">How to Stay Organised Year-Round</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The biggest problem landlords face is not claiming what they are entitled to. Lost receipts, untracked repairs, and last-minute accounting mean deductions slip through the cracks.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is where MyPropertyPal makes the process easier:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Financial Manager:</strong> Track income and expenses in real time, with flexible rent schedules to fit different tenancy agreements. Upload receipts and invoices, which are scanned and categorised automatically for tax purposes.
          </li>
          <li>
            <strong>Document Storage:</strong> Store contracts, certificates, and receipts in one secure place, so they’re always available when needed.
          </li>
          <li>
            <strong>Dashboard and Compliance:</strong> View all properties, payments, and compliance reminders in one dashboard. Stay on top of renewals and avoid penalties that eat into rental income.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why It Matters Now</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          With MTD coming in April 2026, landlords earning over £50,000 will have to submit quarterly income and expense updates digitally. Starting to track everything properly now means:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Fewer missed deductions</li>
          <li>Accurate tax submissions</li>
          <li>Less stress when quarterly reporting begins</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Ready to Keep More of Your Rental Income?</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Sign up today for early access to the MyPropertyPal Beta Release — the all-in-one platform designed for landlords to simplify rent, compliance, and tax.
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