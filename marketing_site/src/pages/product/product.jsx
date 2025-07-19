import Head from "next/head";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";

export default function Product() {
  return (
    <div className="bg-white text-[#171717] font-sans">
      <Head>
        <title>Tenant Features – Beta Release | MyPropertyPal</title>
        <meta name="description" content="Explore all the features available to tenants in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:title" content="Tenant Features – Beta Release | MyPropertyPal" />
        <meta property="og:description" content="Explore all the features available to tenants in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tenant Features – Beta Release | MyPropertyPal" />
        <meta name="twitter:description" content="Explore all the features available to tenants in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta name="twitter:image" content="/LogoWB.png" />
        <link rel="icon" href="/LogoWB.png" />
      </Head>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#2563eb]">Tenant Features – Beta Release</h1>
        <p className="text-lg text-gray-700 mb-2">Part of the MyPropertyPal MVP</p>
        <p className="text-base text-gray-600">Everything your tenants need, in one place. Simple, secure, and built for real-world renting.</p>
      </section>

      {/* Dashboard */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <div className="bg-blue-50 rounded-2xl shadow p-6 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Dashboard</h2>
          <p className="text-gray-700 mb-2">
            See all your rental information at a glance. Stay on top of rent, maintenance, and important documents from one simple dashboard.
          </p>
        </div>
      </section>

      {/* Property Manager */}
      <section className="max-w-5xl mx-auto py-8 px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Properties</h2>
          <p className="text-gray-700 mb-2">
            View all your rented properties, see key details, and manage your tenancy with ease.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Tenants</h2>
          <p className="text-gray-700 mb-2">
            Manage your household, see who’s on the tenancy, and keep everyone in the loop.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Maintenance Requests</h2>
          <p className="text-gray-700 mb-2">
            Report issues and track progress in real time. No more chasing your landlord—get updates as things get fixed.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Contractor Search Tool</h2>
          <p className="text-gray-700 mb-2">
            Find trusted local tradespeople for repairs and improvements, right from your portal.
          </p>
        </div>
      </section>

      {/* Financial Manager */}
      <section className="max-w-5xl mx-auto py-8 px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Finances</h2>
          <p className="text-gray-700 mb-2">
            Track your rent payments, see upcoming due dates, and always know where you stand.
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <strong>Variable Rent Due Dates:</strong> Tenants can have rent due monthly, weekly, fortnightly, or every last Friday of the month. Stay flexible and never miss a payment.
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Documents</h2>
          <p className="text-gray-700 mb-2">
            Access all your important rental documents in one place. Upload, view, and download with ease.
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <strong>AI-powered Invoice/Receipt Scanning:</strong> Instantly scan and categorise receipts and invoices for your records.
          </div>
        </div>
      </section>

      {/* Legal Manager */}
      <section className="max-w-5xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Compliance Tracking</h2>
          <p className="text-gray-700 mb-2">
            Stay compliant with automated reminders for gas safety, EPC, and other legal requirements. Never miss a deadline again.
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <strong>Email Reminders:</strong> Get notified before compliance deadlines so you’re always covered.
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="max-w-5xl mx-auto py-8 px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">AI Chatbot</h2>
          <p className="text-gray-700 mb-2">
            Get instant answers to your questions, 24/7. Our AI assistant helps you with everything from rent queries to maintenance tips.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Messages</h2>
          <p className="text-gray-700 mb-2">
            Communicate directly with your landlord and housemates. Keep all your rental conversations in one secure place.
          </p>
        </div>
      </section>

      {/* Tenant Portal */}
      <section className="max-w-5xl mx-auto py-8 px-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Maintenance Requests</h2>
          <p className="text-gray-700 mb-2">
            Submit and track maintenance issues easily. See updates as your landlord or contractor responds.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Landlord Messaging</h2>
          <p className="text-gray-700 mb-2">
            Message your landlord directly from the portal. No more lost emails or missed calls.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Document Viewing</h2>
          <p className="text-gray-700 mb-2">
            Instantly access your tenancy agreement, compliance certificates, and other key documents.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col mb-4">
          <h2 className="text-xl font-bold text-[#2563eb] mb-2">Rental Management</h2>
          <p className="text-gray-700 mb-2">
            Manage your rent, see your payment history, and stay organised with reminders and notifications.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}