import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

function Landing() {
	const [featureIdx, setFeatureIdx] = useState(0);
	const [pricingIdx, setPricingIdx] = useState(0);
	const pricingRef = useRef(null);
	const navigate = useNavigate();

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
						Get Started
					</button>
				</section>

				<section className="landing-features">
					<h2>Features</h2>
					<div className="carousel-container">
						<button
							className="carousel-arrow"
							onClick={() => setFeatureIdx((featureIdx - 1 + FEATURES.length) % FEATURES.length)}
							aria-label="Previous feature"
						>
							<span>&#8592;</span>
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
							<span>&#8594;</span>
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
						MyPropertyPal is dedicated to making property management simple, transparent, and stress-free for landlords and tenants alike.
						Our platform brings together all the tools you need to manage your rental business efficiently, from maintenance tracking to automated payments and more.
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
							<span>&#8592;</span>
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
							<span>&#8594;</span>
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
			</main>

			<footer className="landing-footer">
				&copy; {new Date().getFullYear()} MyPropertyPal. All rights reserved.
			</footer>
		</div>
	);
}

export default Landing;