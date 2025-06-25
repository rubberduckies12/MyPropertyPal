import React, { useState } from "react";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";
import Link from "next/link.js";
import "../../styles/mtd/mtd.css";

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="mtd-accordion">
      {items.map((item, idx) => (
        <div className="mtd-accordion-item" key={idx}>
          <button
            className={`mtd-accordion-title${openIndex === idx ? " open" : ""}`}
            onClick={() => toggle(idx)}
            aria-expanded={openIndex === idx}
            type="button"
          >
            {item.title}
            <span className="mtd-accordion-arrow">{openIndex === idx ? "▲" : "▼"}</span>
          </button>
          <div
            className="mtd-accordion-content"
            style={{ display: openIndex === idx ? "block" : "none" }}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}

const helpItems = [
  {
    title: "Automatic Record Keeping",
    content: (
      <p>
        All your rental income and expenses are tracked and categorized for you, ready for HMRC.
      </p>
    ),
  },
  {
    title: "Digital Receipts & Invoices",
    content: (
      <p>
        Upload and store receipts, invoices, and statements securely in one place.
      </p>
    ),
  },
  {
    title: "Real-Time Tax Estimation",
    content: (
      <p>
        Get instant insights into your tax obligations as you go, helping you budget and plan ahead.
      </p>
    ),
  },
  {
    title: "MTD-Compatible Submissions",
    content: (
      <p>
        Submit your tax returns directly to HMRC from our platform with just a few clicks.
      </p>
    ),
  },
  {
    title: "Expert Support",
    content: (
      <p>
        Our team of tax experts is here to help you with any questions or issues, ensuring you stay compliant and stress-free.
      </p>
    ),
  },
];

const faqItems = [
  {
    title: "What is Making Tax Digital (MTD)?",
    content: (
      <p>
        MTD is a government initiative that requires landlords to keep digital records and submit tax returns electronically using compatible software.
      </p>
    ),
  },
  {
    title: "Who does MTD apply to?",
    content: (
      <p>
        MTD for Income Tax will soon apply to landlords with property income over £10,000 per year.
      </p>
    ),
  },
  {
    title: "How does MyPropertyPal help with MTD?",
    content: (
      <p>
        MyPropertyPal helps you track income and expenses, store digital records, and (soon) submit your tax returns directly to HMRC.
      </p>
    ),
  },
  {
    title: "Is MyPropertyPal MTD-compliant?",
    content: (
      <p>
        We are building full MTD compliance into our platform to make your transition as smooth as possible.
      </p>
    ),
  },
];

const MTD = () => {
  return (
    <>
      <Head>
        <title>Making Tax Digital (MTD) for Landlords – MyPropertyPal</title>
        <meta
          name="description"
          content="Stay compliant with HMRC's Making Tax Digital (MTD) requirements. MyPropertyPal helps UK landlords automate tax records, digital receipts, and direct submissions."
        />
        <meta property="og:title" content="Making Tax Digital (MTD) for Landlords – MyPropertyPal" />
        <meta
          property="og:description"
          content="Stay compliant with HMRC's Making Tax Digital (MTD) requirements. MyPropertyPal helps UK landlords automate tax records, digital receipts, and direct submissions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/publicassets/LogoWB.png" />
        <meta property="og:url" content="https://mypropertypal.co.uk/mtd" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Making Tax Digital (MTD) for Landlords – MyPropertyPal" />
        <meta
          name="twitter:description"
          content="Stay compliant with HMRC's Making Tax Digital (MTD) requirements. MyPropertyPal helps UK landlords automate tax records, digital receipts, and direct submissions."
        />
        <meta name="twitter:image" content="/publicassets/LogoWB.png" />
        <link rel="canonical" href="https://mypropertypal.co.uk/mtd" />
      </Head>
      <div className="mtd-root">
        <WebpageHeader />

        {/* Hero Section */}
        <section className="mtd-hero">
          <h1>
            <span className="mtd-hero-main">How We Help You</span>
            <br />
            <span className="mtd-hero-highlight">
              Stay Compliant with MTD
            </span>
          </h1>
          <div
            style={{
              marginTop: "2.2rem",
              fontSize: "1.15rem",
              color: "#e0e7ff",
              fontWeight: 500,
            }}
          >
            <strong>30-Day Money-Back Guarantee - No Questions Asked</strong>
          </div>
        </section>

        {/* Sub Hero Section */}
        <section className="mtd-section mtd-values">
          <div className="mtd-hero-sub">
            <p>
              MyPropertyPal empowers UK landlords to meet their tax obligations efficiently and accurately. As HMRC introduces Making Tax Digital, our platform provides the essential tools for seamless compliance, eliminating manual paperwork and reducing the risk of errors.
            </p>
            <p>
              Effortlessly monitor your rental income and expenses in real time, maintain secure digital records, and prepare for direct tax submissions in accordance with HMRC’s MTD requirements.
            </p>
            <p>
              Whether you manage a single property or a large portfolio, MyPropertyPal simplifies tax management, ensures full compliance, and saves you valuable time every year.
            </p>
          </div>
        </section>

        {/* What is MTD Section */}
        <section className="mtd-section mtd-what-is-mtd">
          <h2 className="mtd-features-title">What is MTD?</h2>
          <div className="mtd-hero-sub">
            <p>
              Making Tax Digital (MTD) is a government initiative designed to modernise the UK tax system. It requires landlords and businesses to keep digital financial records and submit tax returns electronically using approved software.
            </p>
            <p>
              The goal of MTD is to minimise mistakes, improve efficiency, and ensure accurate tax payments. Landlords must use compatible software to record income and expenses and to submit their tax information directly to HMRC.
            </p>
            <p>
              MTD for Income Tax will soon be mandatory for landlords with property income exceeding £10,000 per year. Staying compliant with these regulations is crucial to avoid penalties and maintain smooth property management.
            </p>
          </div>
        </section>

        {/* How MyPropertyPal Will Help You Stay Compliant */}
        <section className="mtd-section mtd-how-help">
          <h2 className="mtd-features-title" style={{ textAlign: "center" }}>
            How MyPropertyPal Will Help You Stay Compliant
          </h2>
          <div className="mtd-hero-sub" style={{ textAlign: "center" }}>
            Discover the ways we make MTD compliance easy for landlords:
          </div>
          <Accordion items={helpItems} />
          <Link href="/features/features" className="mtd-cta-button" style={{ marginTop: "2rem" }}>
            View All Features
          </Link>
        </section>

        {/* FAQs Section */}
        <section className="mtd-section mtd-faqs">
          <h2 className="mtd-features-title" style={{ textAlign: "center" }}>
            Frequently Asked Questions
          </h2>
          <div className="mtd-hero-sub" style={{ textAlign: "center" }}>
            Answers to the most common MTD questions for landlords:
          </div>
          <Accordion items={faqItems} />
        </section>

        {/* Call to Action Section */}
        <section className="mtd-section mtd-cta">
          <h2 className="mtd-features-title">Ready to Stay Compliant with MTD?</h2>
          <div className="mtd-hero-sub">
            <p>
              MTD is coming—don’t get caught unprepared. Join our early access program and stay ahead of HMRC’s digital tax requirements with MyPropertyPal.
            </p>
            <Link href="/register" className="mtd-cta-button">
              Start Preparing Today!
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default MTD;