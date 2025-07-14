import React, { useState } from "react";
import Link from "next/link.js";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";
import styles from "../../styles/landing/landing.module.css";

const FEATURES = [
	{
		title: "Automate Rent Collection",
		desc: "Collect rent automatically, securely, and on time—every month, without the hassle.",
	},
	{
		title: "Manage Tenants Easily",
		desc: "Find trusted contractors instantly, log maintenance issues, assign jobs, and resolve them quickly—all in one place.",
	},
	{
		title: "Track Profits & Expenses",
		desc: "Monitor your cash flow, track profits in real-time, and keep your property finances organised with ease.",
	},
	{
		title: "Tenant Portal",
		desc: "Give tenants an easy-to-use portal to pay rent, submit maintenance requests, and communicate directly with you.",
	},
	{
		title: "Tenant Screening",
		desc: "Protect your properties with quick, hassle-free tenant background checks to help you choose the right tenants.",
	},
	{
		title: "Streamline Accounting",
		desc: "Generate HMRC-compliant tax summaries and submit your returns effortlessly with one-click reporting.",
	},
	{
		title: "Access To all Features",
		desc: "Every feature is included in every plan—your price only changes based on how many properties you manage, not which features you use.",
	},
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
		<div className={styles["features-carousel"]}>
			<button
				className={styles["carousel-arrow-left"]}
				onClick={prev}
				aria-label="Previous feature"
			>
				<span className="material-icons" aria-hidden="true">
					arrow_back
				</span>
			</button>
			<div className={styles["features-carousel-track"]}>
				{getVisible().map((feature, idx) => (
					<div
						className={`${styles["feature-card"]} ${styles["carousel-card"]} ${
							idx === 1 ? styles["active"] : styles["faded"]
						}`}
						key={feature.title}
					>
						<h3>{feature.title}</h3>
						<p>{feature.desc}</p>
					</div>
				))}
			</div>
			<button
				className={styles["carousel-arrow-right"]}
				onClick={next}
				aria-label="Next feature"
			>
				<span className="material-icons" aria-hidden="true">
					arrow_forward
				</span>
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
				<meta
					name="description"
					content="Streamline your rental business with powerful tools, built for landlords and loved by tenants. Save time, reduce stress, and focus on what matters most."
				/>
				<meta
					property="og:title"
					content="MyPropertyPal – Automate your rental business"
				/>
				<meta
					property="og:description"
					content="Streamline your rental business with powerful tools, built for landlords and loved by tenants."
				/>
				<meta property="og:type" content="website" />
			</Head>
			<div className={styles["landing-root"]}>
				<WebpageHeader />

				{/* Hero Section */}
				<section id="hero-section" className={`${styles["landing-hero"]} ${styles["landing-card"]}`}>
					<h1 className={styles["landing-card-title"]}>
						<span className={styles["landing-hero-main"]}>MyPropertyPal</span>
						<br />
						<span className={styles["landing-hero-highlight"]}>Automate your rental business</span>
					</h1>
					<div className={styles["landing-card-content"]}>
						<strong>30-Day Money-Back Guarantee - No Questions Asked</strong>
					</div>
				</section>

				{/* Value Props */}
				<section className={`${styles["landing-section"]} ${styles["landing-card"]}`}>
					<p className={styles["landing-card-content"]}>
						Streamline your rental business with powerful tools, built for landlords and loved by tenants. Save time, reduce stress, and focus on what matters most. <br />
						Time is money, and with MyPropertyPal, you can save both.
					</p>
				</section>

				{/* Features Carousel Section */}
				<section className={`${styles["landing-section"]} ${styles["landing-card"]}`}>
					<h2 className={styles["landing-card-title"]}>How We Make it Easy</h2>
					<FeatureCarousel />
					<Link
						href="/features"
						className={styles["landing-card-link"]}
					>
						See All Features
					</Link>
				</section>

				{/* Why Choose MyPropertyPal Section */}
				<section className={`${styles["landing-section"]} ${styles["landing-card"]}`}>
					<h2 className={styles["landing-card-title"]}>Why Choose MyPropertyPal?</h2>
					<p className={styles["landing-card-content"]}>
						Managing rental properties in the UK can be stressful, time-consuming, and overwhelming. From chasing late rent payments and dealing with unreliable contractors to keeping on top of complex tax rules and endless paperwork, landlords face constant challenges. <br /><br />
						<strong>That’s where MyPropertyPal comes in!</strong>
					</p>
					<Link
						href="/about"
						className={styles["landing-card-link"]}
					>
						About Us
					</Link>
				</section>

				{/* Commenting out the entire pricing section */}
				{/* <section className="landing-section landing-pricing">
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
          
          {/* Commenting out the entire pricing section */}
          {/* <div className="pricing-cards">
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
          </div> }
          <div className="pricing-note">
            <strong>One price, all features.</strong> No hidden fees. Cancel anytime.
          </div>
        </section> */}

				{/* How it works Section */}
				<section className={`${styles["landing-section"]} ${styles["landing-card"]}`}>
					<h2 className={styles["landing-card-title"]}>How It Works</h2>
					<ol className={styles["landing-card-list"]}>
						<li>
							<div className={styles["landing-card-step-title"]}>
								<strong>Sign Up</strong>
							</div>
							<div>Create your landlord account in minutes.</div>
						</li>
						<li>
							<div className={styles["landing-card-step-title"]}>
								<strong>Add Your Properties</strong>
							</div>
							<div>Enter your properties and invite your tenants.</div>
						</li>
						<li>
							<div className={styles["landing-card-step-title"]}>
								<strong>Automate Everything</strong>
							</div>
							<div>Collection rent, manage maintenance, and track finances—all from one app.</div>
						</li>
						<li>
							<div className={styles["landing-card-step-title"]}>
								<strong>Grow With Us</strong>
							</div>
							<div>As your portfolio grows, MyPropertyPal grows with you. All features, one price, any scale.</div>
						</li>
					</ol>
				</section>

				{/* Mobile App Section */}
				<section className={`${styles["landing-section"]} ${styles["landing-card"]}`}>
					<h2 className={styles["landing-card-title"]}>The Entire Platform is Currently In Development</h2>
					<div className={styles["landing-card-content"]}>
						MyPropertyPal is actively being developed to bring landlords and tenants the ultimate property management experience.
					</div>
					<div className={styles["landing-card-features"]}>
						<div className={styles["landing-card-feature"]}>
							<span className={styles["landing-card-feature-title"]}>
								<strong>Comprehensive Rent Management</strong>
							</span>
							<div>Track payments, send reminders, and stay on top of your rental income.</div>
						</div>
						<div className={styles["landing-card-feature"]}>
							<span className={styles["landing-card-feature-title"]}>
								<strong>Streamlined Maintenance Handling</strong>
							</span>
							<div>Log issues, assign contractors, and resolve repairs efficiently.</div>
						</div>
						<div className={styles["landing-card-feature"]}>
							<span className={styles["landing-card-feature-title"]}>
								<strong>Secure Communication</strong>
							</span>
							<div>Keep all tenant conversations organized and accessible in one place.</div>
						</div>
						<div className={styles["landing-card-feature"]}>
							<span className={styles["landing-card-feature-title"]}>
								<strong>Financial Insights</strong>
							</span>
							<div>Monitor your cash flow, track expenses, and generate tax reports effortlessly.</div>
						</div>
					</div>
				</section>

				{/* Our Values Section */}
				<section className={styles["landing-values"]}>
					<h2 className={styles["landing-features-title"]}>Our Values</h2>
					<p className={styles["landing-hero-sub"]}>
						We believe in simplifying property management for landlords and tenants alike.
					</p>
				</section>

				{/* Our Mission Section */}
				<section className={styles["landing-mission"]}>
					<h2 className={styles["landing-features-title"]}>Our Mission</h2>
					<p className={styles["landing-hero-sub"]}>
						To provide a seamless and stress-free rental experience for everyone involved.
					</p>
				</section>
			</div>
		</>
	);
};

export default Landing;