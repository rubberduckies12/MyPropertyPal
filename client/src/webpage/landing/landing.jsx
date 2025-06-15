import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import WebpageHeader from "../header/header.jsx";
import "./landing.css";

const FEATURES = [
	{ title: "Maintenance Tracking", desc: "Log, assign, and resolve maintenance requests quickly." },
	{ title: "Automated Payments", desc: "Collect rent automatically and securely, every month." },
	{ title: "Open Banking", desc: "Connect your bank for seamless rent and expense tracking." },
	{ title: "Tenant Screening", desc: "Screen tenants with background and credit checks." },
	{ title: "AI Business Support", desc: "Get AI-powered insights and support for your property business." },
	{ title: "Finance Tracking", desc: "Monitor income, expenses, and cash flow in real time." },
	{ title: "Contract Storage", desc: "Securely store and manage all your contracts and documents." },
	{ title: "S21 Forms", desc: "Generate and manage S21 forms with ease." },
	{ title: "Contractor & Local Business Search", desc: "Find trusted contractors and local services quickly." },
	{ title: "Accounting Tool", desc: "Built-in accounting for landlords and property managers." },
	{ title: "Mortgage Estimator", desc: "Estimate mortgage costs and compare deals." },
	{ title: "Tenant Portal", desc: "Give tenants a portal for payments, requests, and communication." },
];

function FeatureCarousel() {
    const [current, setCurrent] = useState(0);
    const visibleCount = 3;
    const total = FEATURES.length;

    const prev = () => setCurrent((c) => (c - 1 + total) % total);
    const next = () => setCurrent((c) => (c + 1) % total);

    // Get visible features, wrapping around
    const getVisible = () => {
        let arr = [];
        for (let i = 0; i < visibleCount; i++) {
            arr.push(FEATURES[(current + i) % total]);
        }
        return arr;
    };

    return (
        <div className="features-carousel">
            <button className="carousel-arrow left" onClick={prev} aria-label="Previous features">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
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
            <button className="carousel-arrow right" onClick={next} aria-label="Next features">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18"/>
                </svg>
            </button>
        </div>
    );
}

function FAQItem({ question, answer, isOpen, onClick }) {
	return (
		<div className={`faq-item${isOpen ? " open" : ""}`}>
			<button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
				<span>{question}</span>
				<span className={`faq-arrow${isOpen ? " open" : ""}`}>{isOpen ? "▲" : "▼"}</span>
			</button>
			{isOpen && <div className="faq-answer">{answer}</div>}
		</div>
	);
}

function Landing() {
	const [openFAQ, setOpenFAQ] = useState(null);
	const navigate = useNavigate();

	const faqs = [
		{
			question: "Is there a free trial?",
			answer: (
				<>
					Yes! MyPropertyPal offers a 14-day free trial with full access to all features — no credit card required. You can explore everything from automated rent payments to maintenance tracking and tenant communication with zero commitment.
				</>
			),
		},
		{
			question: "Do I need to be tech-savvy to use MyPropertyPal?",
			answer: (
				<>
					Not at all. MyPropertyPal is designed to be user-friendly and intuitive, even if you're not tech-savvy. Whether you're managing a single property or a large portfolio, our simple interface makes it easy to handle rent collection, repairs, and tenant updates — all in just a few clicks.
				</>
			),
		},
		{
			question: "Can I add HMOs (Houses in Multiple Occupation)?",
			answer: (
				<>
					Yes — MyPropertyPal fully supports HMO property management. You can add multi-unit buildings, manage multiple tenants per property, and track shared utilities, maintenance requests, and room-specific leases.
				</>
			),
		},
	];

	const PRICING = [
		{ name: "Starter", price: "£15", per: "/mo", details: ["1 property", "All features included"], cta: "Lets Start" },
		{ name: "Pro", price: "£35", per: "/mo", details: ["Up to 5 properties", "All features included"], cta: "Try Pro" },
		{ name: "Premium", price: "£50", per: "/mo", details: ["Up to 10 properties", "All features included"], cta: "Go Premium" },
		{ name: "Enterprise", price: "Custom", per: "", details: ["More than 10 properties", "All features included"], cta: "Contact Sales" },
	];

	return (
		<div className="landing-root">
			<Helmet>
				<title>MyPropertyPal – Modern Landlord Platform</title>
				<meta name="description" content="Manage your rental income, properties, and tenants in one place. Modern tools for modern landlords." />
				<meta property="og:title" content="MyPropertyPal – Modern Landlord Platform" />
				<meta property="og:description" content="Manage your rental income, properties, and tenants in one place. Modern tools for modern landlords." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/logo.png" />
				<meta name="twitter:card" content="summary_large_image" />
			</Helmet>

			<WebpageHeader />

			<main>
				{/* HERO */}
				<section className="landing-hero grid">
					<div className="hero-content">
						<h1>
							Full Property Management<br />
							<span className="hero-highlight">For Landlords & Tenants</span>
						</h1>
						<p>
							Streamline your rental business with powerful tools built for landlords and loved by tenants. Save time, reduce stress, and grow your property portfolio effortlessly.

						</p>
						<button className="landing-cta-btn" onClick={() => navigate("/register")}>
							Explore Your Free Demo
						</button>
						<p className="landing-cta-subtext">
							Time is money, and MyPropertyPal saves you both.
						</p>
					</div>
					<div className="hero-image">
						<img src="/hero-illustration.svg" alt="Property management illustration" />
					</div>
				</section>

				{/* FEATURES */}
				<section className="landing-features grid">
					<h2>Everything You Need, In One Place</h2>
					<FeatureCarousel />
					<button
        className="landing-cta-btn landing-features-discover"
        onClick={() => navigate("/features")}
        style={{ marginTop: "2.5rem" }}
    >
        Discover More
    </button>
				</section>

				{/* ABOUT */}
				<section className="landing-about grid">
    <div className="about-content">
        <h2>About Us</h2>
        <p>
            <strong>Stress-Free Property Management, All in One Place</strong><br />
            MyPropertyPal gives landlords and tenants everything they need to manage rentals — track maintenance, automate payments, and stay connected — all in one simple, transparent platform.
        </p>
        <button
            className="landing-cta-btn landing-about-more"
            onClick={() => navigate("/company")}
            style={{ marginTop: "2.5rem" }}
        >
            More About Us
        </button>
    </div>
</section>

				{/* PRICING */}
				<section className="landing-pricing grid">
					<h2>Simple, Transparent Pricing</h2>
					<div className="pricing-grid">
						{PRICING.map((tier) => (
							<div className="pricing-card" key={tier.name}>
								<h3>{tier.name}</h3>
								<p className="price">
									{tier.price}
									{tier.per && <span>{tier.per}</span>}
								</p>
								<ul>
									{tier.details.map((d, i) => (
										<li key={i}>{d}</li>
									))}
								</ul>
								{tier.name !== "Enterprise" ? (
									<button
										className="landing-cta-btn"
										onClick={() => navigate("/register")}
									>
										{tier.cta}
									</button>
								) : (
									<button
										className="landing-cta-btn"
										onClick={() => (window.location = "mailto:sales@mypropertypal.com")}
									>
										{tier.cta}
									</button>
								)}
							</div>
						))}
					</div>
				</section>

				{/* WHY */}
				<section className="landing-why grid">
					<h2>Why MyPropertyPal?</h2>
					<div className="why-content">
						<p>
							MyPropertyPal brings together everything landlords and tenants need to manage rental properties, without the stress. From automated rent collection and HMO support to real-time maintenance updates and in-app messaging, our platform is built for simplicity and speed.
						</p>
						<p>
							Whether you’re managing one flat or a growing portfolio, MyPropertyPal helps you save time, stay organized, and keep tenants happy. No jargon. No bloat. Just tools that work.
						</p>
					</div>
				</section>

				{/* FAQ */}
				<section className="landing-faq grid">
					<h2>FAQs</h2>
					<div className="faq-list">
						{faqs.map((faq, idx) => (
							<FAQItem
								key={idx}
								question={faq.question}
								answer={faq.answer}
								isOpen={openFAQ === idx}
								onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
							/>
						))}
					</div>
				</section>
			</main>

			<footer className="landing-footer">
				&copy; {new Date().getFullYear()} MyPropertyPal. All rights reserved.
			</footer>
		</div>
	);
}

export default Landing;