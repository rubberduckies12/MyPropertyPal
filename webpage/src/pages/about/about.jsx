import React from "react";
import Head from "next/head.js";
import WebpageHeader from "../header/header.jsx";

const founders = [
    {
        name: "Tommy Rowe",
        role: "CEO & Managing Director",
        bio: "Leads vision and product strategy. Passionate about seamless user experiences and building a smarter platform for UK landlords.",
        color: "#34d399",
    },
    {
        name: "Chris Thomson",
        role: "Director of Business Operations",
        bio: "Oversees operations and customer success. Ensures MyPropertyPal delivers exceptional support and value to every landlord.",
        color: "#fbbf24",
    },
    {
        name: "Finn Perkins",
        role: "Director of Engineering",
        bio: "Heads engineering and product. Delivers intuitive, high-performance solutions for daily property management.",
        color: "#60a5fa",
    },
];

const About = () => (
    <>
        <Head>
            <title>About Us – MyPropertyPal</title>
            <meta
                name="description"
                content="Meet the MyPropertyPal team. We're passionate about making property management effortless for UK landlords with intuitive tools and expert support."
            />
            <meta property="og:title" content="About Us – MyPropertyPal" />
            <meta
                property="og:description"
                content="Meet the MyPropertyPal team. We're passionate about making property management effortless for UK landlords with intuitive tools and expert support."
            />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="/publicassets/LogoWB.png" />
            <meta property="og:url" content="https://mypropertypal.co.uk/about" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="About Us – MyPropertyPal" />
            <meta
                name="twitter:description"
                content="Meet the MyPropertyPal team. We're passionate about making property management effortless for UK landlords with intuitive tools and expert support."
            />
            <meta name="twitter:image" content="/publicassets/LogoWB.png" />
            <link rel="canonical" href="https://mypropertypal.co.uk/about" />
        </Head>
        <div className="about-root">
            <WebpageHeader />

            {/* Hero Section */}
            <section className="about-hero">
                <h1>
                    <span className="about-hero-main">Great property management</span>
                    <br />
                    <span className="about-hero-highlight">requires a great team</span>
                </h1>
                <p className="about-hero-sub">
                    <strong>
                        30-Day Money-Back Guarantee - No Questions Asked
                    </strong>
                </p>
            </section>

            {/* Value Props */}
            <section className="about-section about-values">
                <div className="about-values-list">
                    {[
                        "Easy to use from day one",
                        "UK-based support team",
                        "Secure, compliant, and reliable",
                        "Built for landlords",
                    ].map((value) => (
                        <div className="about-value" key={value}>
                            <span className="about-value-icon">✅</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Founders Section */}
            <section className="about-section about-team">
                <div className="about-team-card about-team-intro">
                    <h2 className="about-team-title">Meet the MyPropertyPal Team</h2>
                    <p className="about-team-desc">
                        At MyPropertyPal, we’re builders, problem-solvers, and customer-obsessed founders.
                        We’ve worked closely with landlords, property managers, and tenants to deeply understand the frustrations of managing rental properties in the UK.
                        We’re also aspiring property investors ourselves, which means we’re building the exact tools we plan to use on our own journeys—because we believe landlords deserve better.
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
                    Our mission is simple: to make property management effortless for all UK landlords — including our future selves!
                    <br />
                    <br />
                    Whether you’re managing a single property or an entire portfolio, we’re here to support you at every stage.
                    <br />
                    <br />
                    MyPropertyPal is built to grow with you: from your first tenant to your hundredth. As your portfolio expands, so do our tools, our support, and our commitment to helping you succeed.
                </p>
            </section>

            {/* Locations Section */}
            <section className="about-section about-locations">
                <h2>Where We Help Landlords</h2>
                <p>
                    MyPropertyPal proudly supports landlords all across the UK. Whether you own property in a major city, a small town, or anywhere in between, our platform is designed to make managing your rentals simple, secure, and stress-free. No matter where you are on your landlord journey, we’re here to help you succeed—every step of the way.
                </p>
            </section>
        </div>
    </>
);

export default About;