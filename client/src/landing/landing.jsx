import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const FEATURES = [
	{
		title: "Maintenance Tracking",
		desc: "Log, assign, and resolve maintenance requests quickly.",
	},
	{
		title: "Automated Payments",
		desc: "Collect rent and send reminders automatically.",
	},
	{
		title: "Open Banking",
		desc: "Connect your bank for seamless rent and expense tracking.",
	},
	{
		title: "Tenant Screening",
		desc: "Screen tenants with background and credit checks.",
	},
	{
		title: "AI Business Support",
		desc: "Get AI-powered insights and support for your property business.",
	},
	{
		title: "Finance Tracking",
		desc: "Monitor income, expenses, and cash flow in real time.",
	},
	{
		title: "Contract Storage",
		desc: "Securely store and manage all your contracts and documents.",
	},
	{
		title: "S21 Forms",
		desc: "Generate and manage S21 forms with ease.",
	},
	{
		title: "Contractor & Local Business Search",
		desc: "Find trusted contractors and local services quickly.",
	},
	{
		title: "Accounting Tool",
		desc: "Built-in accounting for landlords and property managers.",
	},
	{
		title: "Mortgage Estimator",
		desc: "Estimate mortgage costs and compare deals.",
	},
	{
		title: "Tenant Portal",
		desc: "Give tenants a portal for payments, requests, and communication.",
	},
];

function Landing() {
	const [featureIdx, setFeatureIdx] = useState(0);
	const pricingRef = useRef(null);
	const navigate = useNavigate();

	
	const getVisibleFeatures = () => {
		const total = FEATURES.length;
		return [
			FEATURES[(featureIdx + total - 1) % total],
			FEATURES[featureIdx],
			FEATURES[(featureIdx + 1) % total],
		];
	};

	const prevFeature = () =>
		setFeatureIdx((featureIdx - 1 + FEATURES.length) % FEATURES.length);
	const nextFeature = () =>
		setFeatureIdx((featureIdx + 1) % FEATURES.length);

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
					<div className="features-carousel">
						<button
							className="carousel-arrow improved-arrow"
							onClick={prevFeature}
							aria-label="Previous feature"
						>
							<span>&#8592;</span>
						</button>
						<div className="carousel-track">
							{getVisibleFeatures().map((feature, idx) => (
								<div
									className={`feature-card carousel-card${
										idx === 1 ? " active" : ""
									}`}
									key={feature.title}
								>
									<h3>{feature.title}</h3>
									<p>{feature.desc}</p>
								</div>
							))}
						</div>
						<button
							className="carousel-arrow improved-arrow"
							onClick={nextFeature}
							aria-label="Next feature"
						>
							<span>&#8594;</span>
						</button>
					</div>
					<div className="carousel-dots">
						{FEATURES.map((_, idx) => (
							<span
								key={idx}
								className={`carousel-dot${
									idx === featureIdx ? " active" : ""
								}`}
								onClick={() => setFeatureIdx(idx)}
							/>
						))}
					</div>
				</section>

				<section className="landing-pricing" ref={pricingRef}>
					<h2>Pricing</h2>
					<div className="pricing-cards">
						<div className="pricing-card">
							<h3>Starter</h3>
							<p className="price">
								£15<span>/mo</span>
							</p>
							<ul>
								<li>1 property</li>
								<li>All features included</li>
							</ul>
							<button className="landing-cta-btn" onClick={() => navigate("/login")}>
								Start Free
							</button>
						</div>
						<div className="pricing-card">
							<h3>Pro</h3>
							<p className="price">
								£35<span>/mo</span>
							</p>
							<ul>
								<li>Up to 5 properties</li>
								<li>All features included</li>
							</ul>
							<button className="landing-cta-btn" onClick={() => navigate("/login")}>
								Try Pro
							</button>
						</div>
						<div className="pricing-card">
							<h3>Premium</h3>
							<p className="price">
								£50<span>/mo</span>
							</p>
							<ul>
								<li>Up to 10 properties</li>
								<li>All features included</li>
							</ul>
							<button className="landing-cta-btn" onClick={() => navigate("/login")}>
								Go Premium
							</button>
						</div>
						<div className="pricing-card">
							<h3>Enterprise</h3>
							<p className="price">Custom</p>
							<ul>
								<li>More than 10 properties</li>
								<li>All features included</li>
							</ul>
							<button
								className="landing-cta-btn"
								onClick={() =>
									(window.location = "mailto:sales@mypropertypal.com")
								}
							>
								Contact Sales
							</button>
						</div>
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