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
import { useState } from "react";
import { createPortal } from "react-dom";

const brand = "#2563eb";

// Font size variables for easy adjustment
const FONT_TITLE = "3rem";      // Page title
const FONT_HEADING = "2rem";    // Section headings
const FONT_SUBHEADING = "1.25rem"; // Subheadings
const FONT_TEXT = "1rem";       // Normal text

function FullScreenImageModal({ src, alt, onClose }) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      style={{ cursor: "zoom-out" }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff" }}
      />
      <button
        className="absolute top-6 right-6 text-white text-3xl font-bold"
        onClick={onClose}
        aria-label="Close"
        style={{ cursor: "pointer" }}
      >
        &times;
      </button>
    </div>,
    document.body
  );
}

export default function Product() {
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="bg-white text-[#171717] font-sans min-h-screen">
      <Head>
        <title>The Product – Beta Release | MyPropertyPal</title>
        <meta name="description" content="Explore all the features available in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:title" content="The Product – Beta Release | MyPropertyPal" />
        <meta property="og:description" content="Explore all the features available in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
        <meta property="og:image" content="/LogoWB.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Product – Beta Release | MyPropertyPal" />
        <meta name="twitter:description" content="Explore all the features available in MyPropertyPal. Flexible rent schedules, maintenance requests, messaging, and more." />
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
        <h1
          style={{
            fontSize: FONT_TITLE,
            fontWeight: 800,
            color: brand,
            marginBottom: "1rem",
            letterSpacing: "-1px"
          }}
        >
          The Product – Beta Release
        </h1>
        <p style={{ fontSize: FONT_SUBHEADING, color: "#2563eb", marginBottom: "0.5rem" }}>
          The MyPropertyPal MVP
        </p>
        <p style={{ fontSize: FONT_TEXT, color: "#444" }}>
          Everything you and your tenants need, in one place. Simple, secure, and built for real-world renting.
        </p>
      </section>

      {/* Standardized Section Layout */}
      {[
        {
          title: "Dashboard",
          icon: <MdOutlineManageAccounts size={40} color={brand} />,
          img: "/dashboard.png",
          alt: "Dashboard",
          text: "Get a complete overview of your rental portfolio. Track rent payments, maintenance requests, and compliance deadlines all from one intuitive dashboard.",
        },
        {
          title: "Property Manager",
          icon: <MdPeople size={32} color={brand} />,
          img: "/PropertyManager.png",
          alt: "Property Manager",
          text: (
            <>
              <div>
                <span className="font-semibold">Properties:</span> Manage all your properties in one place. View key details, track compliance, and stay organised.
              </div>
              <div>
                <span className="font-semibold">Tenants:</span> Keep track of your tenants and Communicate with ease, ensure everyone is informed.
              </div>
              <div style={{ marginTop: "1rem" }}>
                <HiOutlineWrenchScrewdriver size={22} color={brand} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <span className="font-semibold">Maintenance Requests:</span> Receive and manage maintenance requests from tenants. Track progress and ensure issues are resolved quickly.
              </div>
              <div>
                <MdHomeRepairService size={22} color={brand} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <span className="font-semibold">Contractor Search Tool:</span> Find trusted local contractors to handle repairs and improvements efficiently.
              </div>
            </>
          ),
        },
        {
          title: "Financial Manager",
          icon: <FaRegMoneyBillAlt size={32} color={brand} />,
          img: "/Financemanager.png",
          alt: "Financial Manager",
          text: (
            <>
              <div>
                <span className="font-semibold">Finances:</span> Stay on top of your rental income. Track payments, monitor due dates, and get a clear picture of your cash flow.
                <div style={{ fontSize: "0.95rem", color: "#666", marginTop: 4 }}>
                  <strong>Flexible Rent Schedules:</strong> Accommodate tenants with monthly, weekly, or custom rent due dates.
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <HiOutlineDocument size={22} color={brand} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <span className="font-semibold">Documents:</span> Organise and access all your important rental documents in one secure location.
                <div style={{ fontSize: "0.95rem", color: "#666", marginTop: 4 }}>
                  <strong>AI-powered Invoice/Receipt Scanning:</strong> Automatically scan and categorise receipts and invoices for tax and record-keeping purposes.
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Legal Manager",
          icon: <MdGavel size={32} color={brand} />,
          img: "/ComplianceManager.png",
          alt: "Legal Manager",
          text: (
            <>
              <div>
                <span className="font-semibold">Compliance Tracking:</span> Ensure your properties meet legal requirements with automated reminders for gas safety, EPCs, and more.
                <div style={{ fontSize: "0.95rem", color: "#666", marginTop: 4 }}>
                  <strong>Email Reminders:</strong> Stay ahead of compliance deadlines with timely notifications.
                </div>
              </div>
            </>
          ),
        },
        {
          title: "AI Chatbot & Messages",
          icon: <PiRobotLight size={32} color={brand} />,
          img: "/AI_Chatbot.png",
          alt: "AI Chatbot",
          text: (
            <>
              <div>
                <span className="font-semibold">AI Chatbot:</span> Get instant answers to your questions about property management, legal compliance, and more.
              </div>
              <div style={{ marginTop: "1rem" }}>
                <HiOutlineChatBubbleLeftRight size={22} color={brand} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <span className="font-semibold">Messages:</span> Communicate directly with tenants and contractors. Keep all your conversations in one secure place.
              </div>
            </>
          ),
        },
        {
          title: "Tenant Portal",
          icon: null,
          img: "/TenantPortal.png",
          alt: "Tenant Portal",
          text: (
            <ul style={{ fontSize: FONT_TEXT, color: "#444", paddingLeft: 0, margin: 0 }}>
              <li><span className="font-semibold">Maintenance Requests:</span> Tenants can submit and track maintenance issues, making it easier for you to respond and resolve them.</li>
              <li><span className="font-semibold">Direct Messaging:</span> Tenants can message you directly through the portal, ensuring clear and organised communication.</li>
              <li><span className="font-semibold">Document Access:</span> Share tenancy agreements, compliance certificates, and other important documents with tenants securely.</li>
              <li><span className="font-semibold">Rental Management:</span> Tenants can view their rent payment history and receive reminders, reducing missed payments.</li>
            </ul>
          ),
        },
      ].map((section, idx) => (
        <section
          key={section.title}
          className="bg-white max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-14 border-b border-gray-100"
          style={{
            alignItems: "center",
            marginBottom: idx === 5 ? "0" : "2rem"
          }}
        >
          {/* Image left, text right for even; reverse for odd */}
          <div className={idx % 2 === 0 ? "order-1" : "order-2"} style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="relative w-full max-w-md h-56 flex items-center justify-center overflow-hidden cursor-zoom-in"
              onClick={() => setModalImg({ src: section.img, alt: section.alt })}
              title="Click to view full screen"
            >
              <Image
                src={section.img}
                alt={section.alt}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
          <div className={idx % 2 === 0 ? "order-2" : "order-1"} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              {section.icon && (
                <span className="rounded-full bg-blue-100 p-4 mr-4">{section.icon}</span>
              )}
              <h2
                style={{
                  fontSize: FONT_HEADING,
                  fontWeight: 700,
                  color: brand,
                  margin: 0
                }}
              >
                {section.title}
              </h2>
            </div>
            <div style={{ fontSize: FONT_TEXT, color: "#444", lineHeight: 1.7 }}>
              {section.text}
            </div>
          </div>
        </section>
      ))}

      {/* Fullscreen Image Modal */}
      {modalImg && (
        <FullScreenImageModal
          src={modalImg.src}
          alt={modalImg.alt}
          onClose={() => setModalImg(null)}
        />
      )}

      <Footer />
    </div>
  );
}