import React, { useState } from "react";
import Link from "next/link.js";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";
import "../../styles/landing/landing.css"; // updated import path

const FEATURES = [
  { title: "Automate Rent Collection", desc: "Collect rent automatically, securely, and on time—every month, without the hassle." },
  { title: "Manage Tenants Easily", desc: "Find trusted contractors instantly, log maintenance issues, assign jobs, and resolve them quickly—all in one place." },
  { title: "Track Profits & Expenses", desc: "Monitor your cash flow, track profits in real-time, and keep your property finances organised with ease." },
  { title: "Tenant Portal", desc: "Give tenants an easy-to-use portal to pay rent, submit maintenance requests, and communicate directly with you." },
  { title: "Tenant Screening", desc: "Protect your properties with quick, hassle-free tenant background checks to help you choose the right tenants." },
  { title: "Streamline Accounting", desc: "Generate HMRC-compliant tax summaries and submit your returns effortlessly with one-click reporting." },
  { title: "Access To all Features", desc: "Every feature is included in every plan—your price only changes based on how many properties you manage, not which features you use." },
];

function FeatureCarousel() {
  const [current, setCurrent] = useState(0);
  const total = FEATURES.length;
  const visibleCount = 3;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const getVisible = () => {
    let arr = [];
    for (let i = 0; i < visibleCount; i++) {
      arr.push(FEATURES[(current + i) % total]);
    }
    return arr;
  };

  return (
    <div className="features-carousel">
      <button className="carousel-arrow left" onClick={prev} aria-label="Previous feature">
        <span className="material-icons" aria-hidden="true">arrow_back</span>
      </button>
      <div className="features-carousel-track">
        {getVisible().map((feature, idx) => (
          <div
            className={`feature-card carousel-card${idx === 1 ? " active" : " faded"}`}
            key={feature.title}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={next} aria-label="Next feature">
        <span className="material-icons" aria-hidden="true">arrow_forward</span>
      </button>
    </div>
  );
}

const Landing = () => {
  const [yearly, setYearly] = useState(false);

  const pricing = {
    starter: yearly ? "£300" : "£30",
    pro: yearly ? "£500" : "£50",
    starterLabel: yearly ? "/yr" : "/mo",
    proLabel: yearly ? "/yr" : "/mo",
  };

  return (
    <>
      <Head>
        <title>MyPropertyPal – Automate your rental business</title>
        <meta name="description" content="Streamline your rental business with powerful tools, built for landlords and loved by tenants. Save time, reduce stress, and focus on what matters most." />
        <meta property="og:title" content="MyPropertyPal – Automate your rental business" />
        <meta property="og:description" content="Streamline your rental business with powerful tools, built for landlords and loved by tenants." />
        <meta property="og:type" content="website" />
      </Head>
      <div className="landing-root">
        <WebpageHeader />

        {/* Hero Section */}
        <section id="hero-section" className="landing-hero">
          <h1>
            <span className="landing-hero-main">MyPropertyPal</span>
            <br />
            <span className="landing-hero-highlight">
              Automate your rental business
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

        {/* Value Props */}
        <section className="landing-section landing-values">
          <p className="landing-hero-sub">
            Streamline your rental business with powerful tools, built for landlords and loved by tenants.
            Save time, reduce stress, and focus on what matters most. <br />
            <Link
              href="/register"
              className="landing-cta-btn"
              style={{ margin: "2rem auto", display: "block" }}
            >
              Explore Your Free Demo Now
            </Link>
            Time is money, and with MyPropertyPal, you can save both.
          </p>
        </section>

        {/* Features Carousel Section */}
        <section className="landing-section landing-features">
          <h2 className="landing-features-title">How We Make it Easy</h2>
          <FeatureCarousel />
          <Link
            href="/features"
            className="landing-cta-btn"
            style={{ margin: "2.5rem auto 0 auto", display: "block" }}
          >
            See All Features
          </Link>
        </section>

        {/* Why Choose MyPropertyPal Section */}
        <section className="landing-section landing-why">
          <h2 className="landing-features-title">Why Choose MyPropertyPal?</h2>
          <p className="why-paragraph">
            Managing rental properties in the UK can be stressful,
            time-consuming, and overwhelming. From chasing late 
            rent payments and dealing with unreliable contractors
            to keeping on top of complex tax rules and endless paperwork,
            landlords face constant challenges. <br /><br />

            <strong>That’s where MyPropertyPal comes in!</strong>
          </p>
          <Link
            href="/about"
            className="landing-cta-btn"
            style={{ margin: "2.5rem auto 0 auto", display: "block" }}
          >
            About Us
          </Link>
        </section>

        {/* Pricing Section */}
        <section className="landing-section landing-pricing">
          <h2 className="landing-features-title">Simple, Transparent Pricing</h2>
          <div className="pricing-toggle-wrap">
            <div className="pricing-toggle-row">
              <span className={!yearly ? "toggle-label active" : "toggle-label"}>Monthly</span>
              <label className="pricing-toggle">
                <span className="visually-hidden">Toggle yearly pricing</span>
                <input
                  type="checkbox"
                  checked={yearly}
                  onChange={() => setYearly(!yearly)}
                />
                <span className="slider"></span>
              </label>
              <span className={yearly ? "toggle-label active" : "toggle-label"}>Yearly</span>
            </div>
            {yearly && <span className="toggle-save">Get 2 Months Free!</span>}
          </div>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-title">Starter</div>
              <div className="pricing-price">
                {pricing.starter}
                <span>{pricing.starterLabel}</span>
              </div>
              <ul className="pricing-features">
                <li>Manage up to 5 properties</li>
                <li>All features included</li>
                <li>Email support</li>
              </ul>
              <Link href="/register" className="landing-cta-btn">
                Get Started
              </Link>
            </div>
            <div className="pricing-card pricing-card-popular">
              <div className="pricing-popular">Most Popular</div>
              <div className="pricing-title">Pro</div>
              <div className="pricing-price">
                {pricing.pro}
                <span>{pricing.proLabel}</span>
              </div>
              <ul className="pricing-features">
                <li>Up to 10 properties</li>
                <li>All features included</li>
                <li>Priority support</li>
              </ul>
              <Link href="/register" className="landing-cta-btn">
                Go Pro
              </Link>
            </div>
            <div className="pricing-card">
              <div className="pricing-title">Portfolio</div>
              <div className="pricing-price">Custom</div>
              <ul className="pricing-features">
                <li>11+ properties</li>
                <li>All features included</li>
                <li>Dedicated account manager</li>
              </ul>
              <Link href="/contact" className="landing-cta-btn">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="pricing-note">
            <strong>One price, all features.</strong> No hidden fees. Cancel anytime.
          </div>
        </section>

        {/* How it works Section */}
        <section className="landing-section landing-mission landing-how-it-works">
          <h2 className="landing-features-title">How It Works</h2>
          <ol className="how-it-works-list">
            <li>
              <div className="how-step-title"><strong>Sign Up</strong></div>
              <div>Create your landlord account in minutes.</div>
            </li>
            <li>
              <div className="how-step-title"><strong>Add Your Properties</strong></div>
              <div>Enter your properties and invite your tenants.</div>
            </li>
            <li>
              <div className="how-step-title"><strong>Automate Everything</strong></div>
              <div>Collect rent, manage maintenance, and track finances—all from one app.</div>
            </li>
            <li>
              <div className="how-step-title"><strong>Grow With Us</strong></div>
              <div>As your portfolio grows, MyPropertyPal grows with you. All features, one price, any scale.</div>
            </li>
          </ol>
          <Link
            href="/register"
            className="landing-cta-btn"
            style={{ margin: "2.5rem auto 0 auto", display: "block" }}
          >
            Get Started
          </Link>
        </section>

        {/* Mobile App Section */}
        <section className="landing-section landing-mobile-app">
          <h2 className="landing-features-title">Currently In Development</h2>
          <div
            className="landing-mobile-app-subtitle"
            style={{
              color: "#64748b",
              fontSize: "1.18rem",
              marginTop: "0.5rem",
              marginBottom: "1.7rem",
              textAlign: "center"
            }}
          >
            The MyPropertyPal Mobile App for Landlords & Tenants
          </div>
          <div className="mobile-app-content">
            <div className="mobile-app-text" style={{ margin: "0 auto", textAlign: "center" }}>
              <p>
                <strong>Your Portfolio in Your Pocket — Because Landlords Deserve Freedom, Too.</strong>
                <br /><br/>
                Property management made easy—track rent, handle repairs, store documents, and talk to tenants, anytime, anywhere.
              </p>
              <div className="mobile-app-features-list">
                <div className="mobile-app-feature-card">
                  <span className="mobile-app-feature-title"><strong>Instant rent notifications</strong></span>
                  <div>Get notified the moment rent is paid or overdue.</div>
                </div>
                <div className="mobile-app-feature-card">
                  <span className="mobile-app-feature-title"><strong>Easy maintenance logging</strong></span>
                  <div>Log and track repairs from anywhere, anytime.</div>
                </div>
                <div className="mobile-app-feature-card">
                  <span className="mobile-app-feature-title"><strong>Secure messaging with tenants</strong></span>
                  <div>Communicate safely and keep all conversations in one place.</div>
                </div>
                <div className="mobile-app-feature-card">
                  <span className="mobile-app-feature-title"><strong>Real-time financial tracking</strong></span>
                  <div>See your property income and expenses at a glance.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;