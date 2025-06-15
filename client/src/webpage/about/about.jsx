import React from "react";
import WebpageHeader from "../header/header.jsx";
import "./about.css";

const founders = [
	{
		name: "Tommy Rowe",
		role: "CEO",
		bio: "Leads vision and product strategy. Passionate about seamless user experiences and building a smarter platform for UK landlords.",
		color: "#34d399",
	},
	{
		name: "Chris Thomson",
		role: "COO",
		bio: "Operational backbone. Ensures MyPropertyPal is secure, reliable, and ready to scale with every landlord’s portfolio.",
		color: "#fbbf24",
	},
	{
		name: "Fin Perkins",
		role: "Director of Engineering",
		bio: "Heads engineering and product. Delivers intuitive, high-performance solutions for daily property management.",
		color: "#60a5fa",
	},
];

const About = () => {
	return (
		<div className="about-root">
			<WebpageHeader />

			{/* Hero Section */}
			<section className="about-hero">
				<h1>
					<span className="about-hero-main">Great property management</span>
					<br />
					<span className="about-hero-highlight">
						requires a great team
					</span>
				</h1>
				<p className="about-hero-sub">
					MyPropertyPal is built for landlords. We’re here to make
					your life easier with intuitive tools, expert support, and a team that
					cares about your success.
				</p>
			</section>

			{/* Value Props */}
			<section className="about-section about-values">
				<div className="about-values-list">
					<div className="about-value">
						<span className="about-value-icon">✅</span>
						<span>Easy to use from day one</span>
					</div>
					<div className="about-value">
						<span className="about-value-icon">✅</span>
						<span>UK-based support team</span>
					</div>
					<div className="about-value">
						<span className="about-value-icon">✅</span>
						<span>Secure, compliant, and reliable</span>
					</div>
					<div className="about-value">
						<span className="about-value-icon">✅</span>
						<span>Built for landlords</span>
					</div>
				</div>
			</section>

			{/* Founders Section */}
			<section className="about-section about-team">
				<h2 className="about-team-title">Meet the MyPropertyPal Team</h2>
				<div className="about-team-desc-wrapper">
					<p className="about-team-desc">
						At MyPropertyPal, we’re passionate builders and problem-solvers dedicated to making property management effortless.<br /><br />
						
						As aspiring property investors ourselves, we’re committed to creating the tools we want to use — because we believe landlords deserve better.
					</p>
				</div>
				<div className="about-team-grid">
					{founders.map((f) => (
						<div className="about-team-card" key={f.name}>
							<div
								className="about-team-avatar"
								style={{ background: f.color }}
								aria-label={f.name}
							>
								<span className="about-team-avatar-initials">
									{f.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</span>
							</div>
							<div className="about-team-info">
								<div className="about-team-name">{f.name}</div>
								<div className="about-team-role">{f.role}</div>
								<div className="about-team-bio">{f.bio}</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Mission Section */}
			<section className="about-section about-mission">
				<h2>Our Mission</h2>
				<p>
					Our mission is simple: to make property management effortless for all UK landlords — including our future selves!<br /><br />
					Whether you’re managing a single property or an entire portfolio, we’re here to support you at every stage.<br /><br />
					MyPropertyPal is built to grow with you: from your first tenant to your hundredth. As your portfolio expands, so do our tools, our support, and our commitment to helping you succeed.
				</p>
			</section>

			{/* Locations Section */}
			<section className="about-section about-locations">
				<h2>Where We Help Landlords</h2>
				<p>MyPropertyPal proudly supports landlords in:</p>
				<ul className="about-locations-list">
					<li>London</li>
					<li>Manchester</li>
					<li>Birmingham</li>
					<li>Liverpool</li>
					<li>Leeds</li>
					<li>Sheffield</li>
					<li>And across the UK!</li>
				</ul>
			</section>
		</div>
	);
};

export default About;
