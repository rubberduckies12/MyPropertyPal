import React from "react";
import WebpageHeader from "../header/header.jsx";
import "./features.css";

const FEATURES_SECTIONS = [
	{
		title: "Property Management Features",
		features: [
			{
				name: "Property Tracker",
				description:
					"Easily track, manage, and monitor all your properties in one streamlined dashboard.",
			},
			{
				name: "Tenant Manager",
				description:
					"Easily manage tenant profiles, leases, payments, and communication in one place.",
			},
			{
				name: "Maintenance Request Hub",
				description:
					"Tenants can quickly report incidents with photos and details, while property managers can prioritize by severity, assign tasks, and track resolution progress from submission to resolution.",
			},
			{
				name: "Messages & Notifications",
				description:
					"Instantly communicate with tenants and receive real-time notifications for updates, payments, and incidents.",
			},
			{
				name: "Tenant Screening & Background Checks",
				description:
					"Quickly screen potential tenants with background, credit, and rental history checks for smarter leasing decisions.",
			},
			{
				name: "Local Contractor Search",
				description:
					"Instantly find and connect with trusted local contractors for maintenance and repair jobs near your properties.",
			},
			{
				name: "Tenant Portal",
				description:
					"A dedicated space for tenants to submit maintenance requests, send messages, track updates, and access exclusive tenant benefits like discounts on home appliances.",
			},
		],
	},
	{
		title: "Financial Management Features",
		features: [
			{
				name: "Automatic Rent Collection",
				description:
					"Automate rent payments with secure, recurring transactions and real-time payment tracking.",
			},
			{
				name: "Incoming and Outgoing Expense Tracking",
				description:
					"Track all incoming rent and outgoing property expenses in one place for clear, real-time financial oversight.",
			},
			{
				name: "Smart Document Scanning & Storage",
				description:
					"Scan and digitize documents, invoices, and receipts instantly using Google Vision for easy storage and quick retrieval.",
			},
			{
				name: "HMRC Tax Reporting",
				description:
					"Automatically generate and submit accurate tax reports directly to HMRC using seamless API integration.",
			},
			{
				name: "Portfolio value tracking",
				description:
					"Monitor the real-time market value and performance of your entire property portfolio in one place.",
			},
		],
	},
	{
		title: "Legal Management Features",
		features: [
			{
				name: "Compliance Reminders (Gas Safety, EICR, etc.)",
				description:
					"Never miss a legal deadline with automated compliance reminders.",
			},
			{
				name: "Automated Notice Generation",
				description:
					"Generate legally compliant notices and documents in just a few clicks. (S21, etc.)",
			},
			{
				name: "Digital Signature Support",
				description:
					"Sign and send documents securely with integrated digital signatures.",
			},
			{
				name: "Deposit Scheme Integration",
				description:
					"Easily manage and track tenant deposits with scheme integration.",
			},
		],
	},
	{
		title: "Business Management Features",
		features: [
			{
				name: "Mortgage Calculator",
				description:
					"Quickly estimate monthly mortgage payments based on loan amount, interest rate, and term.",
			},
			{
				name: "Task & Reminder System",
				description:
					"Stay organized with tasks, reminders, and to-dos for every property.",
			},
			{
				name: "Smart Listing Matcher",
				description:
					"Discover relevant property listings tailored to your portfolio by matching key criteria for smarter investment opportunities.",
			},
			{
				name: "Multi-user Access (Accountants, Agents, etc.)",
				description:
					"Invite your accountant, letting agent, or team to collaborate securely.",
			},
		],
	},
	{
		title: "Growth & Training Management Features",
		features: [
			{
				name: "Landlord Training Resources",
				description:
					"Access guides, webinars, and resources to grow your landlord skills.",
			},
			{
				name: "Market Insights & Analytics",
				description:
					"Stay ahead with local market trends, analytics, and benchmarking.",
			},
			{
				name: "Portfolio Growth Tools",
				description:
					"Tools and calculators to help you expand your rental portfolio.",
			},
			{
				name: "Community & Support Access",
				description:
					"Join a community of landlords and get expert support when you need it.",
			},
		],
	},
	{
		title: "Other Features",
		features: [
			{
				name: "Mobile Friendly Design",
				description:
					"Manage your rentals from any device, anywhere, anytime.",
			},
			{
				name: "24/7 Support",
				description:
					"Get help whenever you need it with round-the-clock support.",
			},
			{
				name: "AI Chatbot",
				description:
					"Get instant, AI-powered support and answers for tenants and landlords anytime, streamlining communication and issue resolution.",
			},
			{
				name: "Data Security & Backups",
				description:
					"Your data is encrypted, secure, and backed up automatically.",
			},
		],
	},
];

export default function Features() {
	return (
		<div className="features-root">
			<WebpageHeader />

			{/* Hero Section */}
			<section className="features-hero">
				<h1>
					<span className="features-hero-main">All Features</span>
					<br />
					<span className="features-hero-highlight">
						Everything you need to manage your rentals
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

			{/* Sub Hero / Intro */}
			<section className="features-section-card features-sub-hero">
				<p className="features-hero-sub">
					Discover every tool included with MyPropertyPal. <br />
					Take complete control of your rental business with MyPropertyPal’s
					powerful, all-in-one property management platform. With no hidden fees,
					no feature restrictions, and unlimited access to every tool, MyPropertyPal
					is built to help landlords, property managers, and real estate investors
					automate, streamline, and scale their rental operations with ease.
				</p>
			</section>

			{/* Features Sections */}
			{FEATURES_SECTIONS.map((section) => (
				<section className="features-section-card" key={section.title}>
					<h2 className="features-section-title">{section.title}</h2>
					<div className="features-cards-list">
						{section.features.map((feature) => (
							<div
								className="feature-inner-card modern-feature-card"
								key={feature.name}
							>
								<div>
									<span className="feature-inner-card-title">
										{feature.name}
									</span>
									<span className="feature-inner-card-desc">
										{feature.description}
									</span>
								</div>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}