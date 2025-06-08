import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./landing.css";

const FEATURES = [
	{ title: "Maintenance Tracking", desc: "Log, assign, and resolve maintenance requests quickly." },
	{ title: "Automated Payments", desc: "Collect rent and send reminders automatically." },
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

const PRICING = [
	{ name: "Starter", price: "£15", per: "/mo", details: ["1 property", "All features included"], cta: "Start Free" },
	{ name: "Pro", price: "£35", per: "/mo", details: ["Up to 5 properties", "All features included"], cta: "Try Pro" },
	{ name: "Premium", price: "£50", per: "/mo", details: ["Up to 10 properties", "All features included"], cta: "Go Premium" },
	{ name: "Enterprise", price: "Custom", per: "", details: ["More than 10 properties", "All features included"], cta: "Contact Sales" },
];

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="faq-item">
            <button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
                <span>{question}</span>
                <span className={`faq-arrow${isOpen ? " open" : ""}`}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
}

function Landing() {
	const [featureIdx, setFeatureIdx] = useState(0);
	const [pricingIdx, setPricingIdx] = useState(0);
	const [openFAQ, setOpenFAQ] = useState(null);
	const pricingRef = useRef(null);
	const navigate = useNavigate();

	const faqs = [
		{
			question: "Is there a free trial?",
			answer: (
				<>
					Yes! MyPropertyPal offers a 14-day free trial with full access to all features — no credit card required. You can explore everything from automated rent payments to maintenance tracking and tenant communication with zero commitment. Our goal is to give landlords and tenants the freedom to see how easy and powerful our property management platform really is.
				</>
			),
		},
		{
			question: "Do I need to be tech-savvy to use MyPropertyPal?",
			answer: (
				<>
					Not at all. MyPropertyPal is designed to be user-friendly and intuitive, even if you're not tech-savvy. Whether you're managing a single property or a large portfolio, our simple interface makes it easy to handle rent collection, repairs, and tenant updates — all in just a few clicks. Landlords love how it saves time without the tech overwhelm.
				</>
			),
		},
		{
			question: "Can I add HMOs (Houses in Multiple Occupation)?",
			answer: (
				<>
					Yes — MyPropertyPal fully supports HMO property management. You can add multi-unit buildings, manage multiple tenants per property, and track shared utilities, maintenance requests, and room-specific leases. Whether you manage one HMO or several, our tools make it easy to stay organized and compliant.
				</>
			),
		},
	];

	// Carousel helpers
	const getVisible = (arr, idx) => {
		const total = arr.length;
		return [
			arr[(idx + total - 1) % total],
			arr[idx],
			arr[(idx + 1) % total],
		];
	};

	const scrollToPricing = () => {
		pricingRef.current?.scrollIntoView({ behavior: "smooth" });
	};

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

			<header className="landing-header">
				<img src="/logo.png" alt="Logo" className="landing-logo" />
				<button className="landing-login-btn" onClick={() => navigate("/login")}>
					Log In
				</button>
			</header>

			<main>
				<section className="landing-hero">
					<h1>Welcome to MyPropertyPal</h1>
					<p>
						The all in one rental ecosystem - Manage your rental income, properties and tenants in one place.
					</p>
					<button className="landing-cta-btn" onClick={scrollToPricing}>
						Get Started Free
					</button>
					<p className="landing-cta-subtext">
						Built for landlords, loved by tenants.
					</p>
				</section>

				<section className="landing-features">
					<h2>Features</h2>
					<div className="carousel-container">
						<button
							className="carousel-arrow"
							onClick={() => setFeatureIdx((featureIdx - 1 + FEATURES.length) % FEATURES.length)}
							aria-label="Previous feature"
						>
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
</svg>
							</span>
						</button>
						<div className="carousel-track">
							{getVisible(FEATURES, featureIdx).map((feature, idx) => (
								<div className={`carousel-card${idx === 1 ? " active" : ""}`} key={feature.title}>
									<h3>{feature.title}</h3>
									<p>{feature.desc}</p>
								</div>
							))}
						</div>
						<button
							className="carousel-arrow"
							onClick={() => setFeatureIdx((featureIdx + 1) % FEATURES.length)}
							aria-label="Next feature"
						>
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
</svg>
							</span>
						</button>
					</div>
					<div className="carousel-dots">
						{FEATURES.map((_, idx) => (
							<span
								key={idx}
								className={`carousel-dot${idx === featureIdx ? " active" : ""}`}
								onClick={() => setFeatureIdx(idx)}
							/>
						))}
					</div>
				</section>

				<section className="landing-about">
					<h2>About Us</h2>
					<p>
						<strong>Stress-Free Property Management, All in One Place</strong><br />
						MyPropertyPal gives landlords and tenants everything they need to manage rentals — track maintenance, automate payments, and stay connected — all in one simple, transparent platform.
					</p>
				</section>

				<section className="landing-pricing" ref={pricingRef}>
					<h2>Pricing</h2>
					<div className="carousel-container">
						<button
							className="carousel-arrow"
							onClick={() => setPricingIdx((pricingIdx - 1 + PRICING.length) % PRICING.length)}
							aria-label="Previous pricing"
						>
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
							</span>
						</button>
						<div className="carousel-track">
							{getVisible(PRICING, pricingIdx).map((tier, idx) => (
								<div className={`pricing-card carousel-card${idx === 1 ? " active" : ""}`} key={tier.name}>
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
										<button className="landing-cta-btn" onClick={() => navigate("/login")}>
											{tier.cta}
										</button>
									) : (
										<button className="landing-cta-btn" onClick={() => (window.location = "mailto:sales@mypropertypal.com")}>
											{tier.cta}
										</button>
									)}
								</div>
							))}
						</div>
						<button
							className="carousel-arrow"
							onClick={() => setPricingIdx((pricingIdx + 1) % PRICING.length)}
							aria-label="Next pricing"
						>
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
    </svg>
							</span>
						</button>
					</div>
					<div className="carousel-dots">
						{PRICING.map((_, idx) => (
							<span
								key={idx}
								className={`carousel-dot${idx === pricingIdx ? " active" : ""}`}
								onClick={() => setPricingIdx(idx)}
							/>
						))}
					</div>
				</section>

				<section className="landing-why">
  <h2>Why MyPropertyPal?</h2>
  <p>
    MyPropertyPal brings together everything landlords and tenants need to manage rental properties, without the stress. From automated rent collection and HMO support to real-time maintenance updates and in-app messaging, our platform is built for simplicity and speed.
  </p>
  <p>
    Whether you’re managing one flat or a growing portfolio, MyPropertyPal helps you save time, stay organized, and keep tenants happy. No jargon. No bloat. Just tools that work.
  </p>
</section>

				<section className="landing-faq">
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