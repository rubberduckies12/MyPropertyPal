import Head from "next/head";
import DesktopHeader from "../../../../../components/desktop/desktopHeader";
import MobileHeader from "../../../../../components/mobile/mobileHeader";
import Footer from "../../../../../components/desktop/desktopFooter";

export default function ProsAndCons() {
  return (
    <div className="bg-gray-50 text-[#171717] font-sans">
      <Head>
        <title>The Pros and Cons of Self-Managing Your Properties vs. Using an Agent | MyPropertyPal</title>
        <meta
          name="description"
          content="Discover the pros and cons of self-managing your properties vs. using an agent. Learn how MyPropertyPal simplifies self-management for landlords."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Pros and Cons of Self-Managing Your Properties vs. Using an Agent | MyPropertyPal" />
        <meta
          property="og:description"
          content="Discover the pros and cons of self-managing your properties vs. using an agent. Learn how MyPropertyPal simplifies self-management for landlords."
        />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Pros and Cons of Self-Managing Your Properties vs. Using an Agent | MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Discover the pros and cons of self-managing your properties vs. using an agent. Learn how MyPropertyPal simplifies self-management for landlords."
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
          The Pros and Cons of Self-Managing Your Properties vs. Using an Agent
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          When it comes to being a landlord, one of the biggest decisions you’ll make is whether to self-manage your properties or hire a letting/management agent. Both approaches come with benefits and drawbacks — and the best option often depends on your time, experience, and tools.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          With the rise of digital platforms like MyPropertyPal, many landlords are rethinking the need for costly agents. Let’s break down the pros and cons of each approach and why more landlords are choosing to take control of their own portfolios.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Case for Self-Managing</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pros of Self-Managing:</h3>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Lower Costs:</strong> Agents typically charge between 8–15% of your monthly rental income (sometimes even more for full management). Self-managing means keeping more of your rental income.
          </li>
          <li>
            <strong>Direct Tenant Relationships:</strong> Managing your own properties gives you direct contact with your tenants, resulting in fewer misunderstandings, faster issue resolution, and stronger landlord-tenant relationships.
          </li>
          <li>
            <strong>Full Control:</strong> As a self-managing landlord, you decide how to handle maintenance, tenant screening, and compliance, giving you more flexibility.
          </li>
          <li>
            <strong>Better Oversight of Finances:</strong> With no agent taking a cut or handling your money, you have complete visibility into your rental income and expenses, making budgeting and preparing accounts easier.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cons of Self-Managing:</h3>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Time Commitment:</strong> Managing properties takes time, from chasing late rent to handling maintenance requests.
          </li>
          <li>
            <strong>Legal Responsibilities:</strong> Landlords are responsible for meeting compliance requirements (gas safety, EPCs, electrical checks, etc.), which can be overwhelming without proper systems.
          </li>
          <li>
            <strong>Dealing with Difficult Situations:</strong> Handling late payments, tenant disputes, or evictions can be stressful if you’re not experienced.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">The Case for Using an Agent</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pros of Using an Agent:</h3>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>Convenience:</strong> Agents handle tenant queries, viewings, rent collection, and maintenance, offering a hands-off approach.
          </li>
          <li>
            <strong>Industry Knowledge:</strong> Good agents understand the market, have access to contractors, and know the legal requirements inside out.
          </li>
          <li>
            <strong>Reduced Stress:</strong> For landlords who view property purely as a passive investment, agents can provide peace of mind.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cons of Using an Agent:</h3>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>
            <strong>High Costs:</strong> Agent fees can significantly reduce your rental yield, adding up to thousands in lost profit over time.
          </li>
          <li>
            <strong>Lack of Transparency:</strong> Landlords don’t always get visibility of costs when agents manage repairs or contractor quotes, and some agents add mark-ups on maintenance bills.
          </li>
          <li>
            <strong>Less Control:</strong> Agents act on your behalf, but they also make decisions you may not agree with, such as choosing tenants or scheduling repairs.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Why More Landlords Are Choosing to Self-Manage in 2025</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          In the past, many landlords chose agents because self-management felt overwhelming. But with modern property management software, landlords can now take full control without drowning in admin.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is where MyPropertyPal comes in. It’s built for small landlords who want the benefits of self-management without the downsides.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-8 leading-relaxed">
          <li>Save money by cutting out agent fees while still keeping everything organised.</li>
          <li>Stay compliant with automated reminders for gas safety checks, EPCs, and other legal requirements.</li>
          <li>Communicate easily with tenants via the Tenant Portal and in-app messaging.</li>
          <li>Track finances effortlessly with the Financial Manager and AI-powered receipt scanning.</li>
          <li>Handle maintenance efficiently using the built-in request tracker and contractor search tool.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Final Thoughts</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          So, should you self-manage or use an agent? If you value convenience above all and don’t mind sacrificing part of your rental yield, an agent may still suit you. But if you want more control, higher profitability, and stronger tenant relationships, self-management is the better option — and with tools like MyPropertyPal, it’s easier than ever.
        </p>

        <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Take Control of Your Portfolio Today</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The MyPropertyPal Beta Release is here to help landlords simplify property management, reduce costs, and stay compliant — all from one secure platform.
        </p>

        {/* Join MyPropertyPal Button */}
        <div className="text-center mt-12">
          <a
            href="https://app.mypropertypal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full px-10 py-4 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Sign up today to manage your properties smarter with MyPropertyPal
          </a>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}