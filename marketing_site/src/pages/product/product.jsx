import Head from "next/head";
import Image from "next/image";
import Header from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";
import { HiOutlineChatBubbleLeftRight, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { MdGavel, MdHomeRepairService, MdPeople, MdOutlineManageAccounts } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { PiRobotLight } from "react-icons/pi";
import { HiOutlineDocument } from "react-icons/hi2";

const brand = "#2563eb";

export default function Product() {
  return (
    <div className="bg-white text-[#171717] font-sans min-h-screen">
      <Head>
        <title>The Product – Beta Release | MyPropertyPal</title>
        <meta name="description" content="Explore all the features available to tenants in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:title" content="The Product – Beta Release | MyPropertyPal" />
        <meta property="og:description" content="Explore all the features available to tenants in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Product – Beta Release | MyPropertyPal" />
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
      <section className="max-w-3xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#2563eb] tracking-tight">Tenant Features – Beta Release</h1>
        <p className="text-lg text-gray-700 mb-2">The MyPropertyPal MVP</p>
        <p className="text-base text-gray-600">Everything you and your tenants need, in one place. Simple, secure, and built for real-world renting.</p>
      </section>

      {/* Dashboard - image left, text right */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/Dashboard.png"
              alt="Dashboard"
              fill
              style={{ objectFit: "contain" }}
              className=""
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="mb-4 rounded-full bg-blue-100 p-4">
            <MdOutlineManageAccounts size={40} color={brand} />
          </div>
          <h2 className="text-3xl font-bold text-[#2563eb] mb-2">Dashboard</h2>
          <p className="text-gray-700 text-lg">
            See all your rental information at a glance. Stay on top of rent, maintenance, and important documents from one simple dashboard.
          </p>
        </div>
      </section>

      {/* Property Manager - text left, image right */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100">
        <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div>
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <MdPeople size={32} color={brand} />
            </div>
            <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Property Manager</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li>
                <span className="font-semibold">Properties:</span> View all your rented properties, see key details, and manage your tenancy with ease.
              </li>
              <li>
                <span className="font-semibold">Tenants:</span> Manage your household, see who’s on the tenancy, and keep everyone in the loop.
              </li>
            </ul>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <HiOutlineWrenchScrewdriver size={32} color={brand} />
            </div>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-2">
                <span>
                  <span className="font-semibold">Maintenance Requests:</span> Report issues and track progress in real time. No more chasing your landlord—get updates as things get fixed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MdHomeRepairService size={22} color={brand} className="mt-1" />
                <span>
                  <span className="font-semibold">Contractor Search Tool:</span> Find trusted local tradespeople for repairs and improvements, right from your portal.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/PropertyManager.png"
              alt="Property Manager"
              fill
              style={{ objectFit: "contain" }}
              className=""
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </section>

      {/* Financial Manager - image right, text left */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100">
        <div className="order-2 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/Financemanager.png"
              alt="Financial Manager"
              fill
              style={{ objectFit: "contain" }}
              className=""
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
        <div className="order-1 md:order-1 grid md:grid-cols-2 gap-12 items-start w-full">
          <div>
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <FaRegMoneyBillAlt size={32} color={brand} />
            </div>
            <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Financial Manager</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li>
                <span className="font-semibold">Finances:</span> Track your rent payments, see upcoming due dates, and always know where you stand.
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Variable Rent Due Dates:</strong> Tenants can have rent due monthly, weekly, fortnightly, or every last Friday of the month. Stay flexible and never miss a payment.
                </div>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <HiOutlineDocument size={32} color={brand} />
            </div>
            <ul className="space-y-4 text-gray-700 text-lg mt-8 md:mt-0">
              <li>
                <span className="font-semibold">Documents:</span> Access all your important rental documents in one place. Upload, view, and download with ease.
                <div className="text-sm text-gray-600 mt-1">
                  <strong>AI-powered Invoice/Receipt Scanning:</strong> Instantly scan and categorise receipts and invoices for your records.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Legal Manager - image left, text right */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/ComplianceManager.png"
              alt="Legal Manager"
              fill
              style={{ objectFit: "contain" }}
              className=""
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="mb-4 rounded-full bg-blue-100 p-4">
            <MdGavel size={32} color={brand} />
          </div>
          <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Legal Manager</h2>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li>
              <span className="font-semibold">Compliance Tracking:</span> Stay compliant with automated reminders for gas safety, EPC, and other legal requirements. Never miss a deadline again.
              <div className="text-sm text-gray-600 mt-1">
                <strong>Email Reminders:</strong> Get notified before compliance deadlines so you’re always covered.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Additional Features - text left, image right */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100">
        <div className="order-2 md:order-1 grid md:grid-cols-2 gap-12 items-start w-full">
          <div>
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <PiRobotLight size={32} color={brand} />
            </div>
            <h2 className="text-2xl font-bold text-[#2563eb] mb-2">AI Chatbot</h2>
            <p className="text-gray-700 text-lg">
              Get instant answers to your questions, 24/7. Our AI assistant helps you with everything from rent queries to maintenance tips.
            </p>
          </div>
          <div>
            <div className="mb-4 rounded-full bg-blue-100 p-4 w-fit">
              <HiOutlineChatBubbleLeftRight size={32} color={brand} />
            </div>
            <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Messages</h2>
            <p className="text-gray-700 text-lg">
              Communicate directly with your landlord and housemates. Keep all your rental conversations in one secure place.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/AI_Chatbot.png"
              alt="AI Chatbot"
              fill
              style={{ objectFit: "contain" }}
              className=""
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </section>

      {/* Tenant Portal - image center on mobile, right on desktop */}
      <section className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14">
        <div className="order-2 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden">
            <Image
              src="/TenantPortal.png"
              alt="Tenant Portal"
              fill
              style={{ objectFit: "contain" }}
              className=""
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
        <div className="order-1 md:order-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <h2 className="text-2xl font-bold text-[#2563eb] mb-2">Tenant Portal</h2>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li>
              <span className="font-semibold">Maintenance Requests:</span> Submit and track maintenance issues easily. See updates as your landlord or contractor responds.
            </li>
            <li>
              <span className="font-semibold">Landlord Messaging:</span> Message your landlord directly from the portal. No more lost emails or missed calls.
            </li>
            <li>
              <span className="font-semibold">Document Viewing:</span> Instantly access your tenancy agreement, compliance certificates, and other key documents.
            </li>
            <li>
              <span className="font-semibold">Rental Management:</span> Manage your rent, see your payment history, and stay organised with reminders and notifications.
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}