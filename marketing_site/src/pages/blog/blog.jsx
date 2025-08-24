import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import DesktopHeader from "../../components/desktop/desktopHeader";
import MobileHeader from "../../components/mobile/mobileHeader";
import Footer from "../../components/desktop/desktopFooter";

const blogPosts = [
	{
		title: "How to Prepare Your Property Accounts for HMRC in Under an Hour",
		slug: "taxAndFinance/taxlessthan1hour",
		images: ["/BlogImages/Tax&Finance/HMRCunder1hr.png"],
		category: "Tax & Finance",
		topics: ["Tax & Finance"],
		description:
			"Learn how to prepare your property accounts for HMRC in under an hour with MyPropertyPal. Simplify landlord accounting with our digital property management tools.",
	},
	{
		title: "Landlord Tax Deductions Explained: Save Money With Smarter Tracking",
		slug: "taxAndFinance/TaxDeductions",
		images: ["/BlogImages/Tax&Finance/taxdeduction.png"],
		category: "Tax & Finance",
		topics: ["Tax & Finance"],
		description:
			"Discover how landlords can maximise tax savings with MyPropertyPal. Learn about allowable deductions and smarter expense tracking.",
	},
	{
		title: "Making Tax Digital for Landlords: What You Need to Know Before 2026",
		slug: "taxAndFinance/MTD",
		images: ["/BlogImages/Tax&Finance/mtd.png"],
		category: "Tax & Finance",
		topics: ["Tax & Finance"],
		description:
			"Learn how landlords can prepare for HMRC's Making Tax Digital (MTD) rules. Discover how MyPropertyPal simplifies digital record keeping and quarterly submissions.",
	},
	{
		title: "The Ultimate Guide to Landlord Expenses: What You Can and Can’t Claim",
		slug: "taxAndFinance/UltimateGuide",
		images: ["/BlogImages/Tax&Finance/Ug.png"],
		category: "Tax & Finance",
		topics: ["Tax & Finance"],
		description:
			"Learn what expenses landlords can and can’t claim at tax time. Discover how MyPropertyPal simplifies expense tracking and compliance for landlords.",
	},
	{
		title: "The 7 Biggest Mistakes New Landlords Make (And How to Avoid Them)",
		slug: "L&PManagement/7Mistakes",
		images: ["/BlogImages/L&PManagement/7mistakes.png"],
		category: "Landlord & Portfolio Management",
		topics: ["Landlord & Portfolio Management"],
		description:
			"Discover the 7 biggest mistakes new landlords make and learn how to avoid them. MyPropertyPal simplifies property management for landlords.",
	},
	{
		title: "The Complete Guide to Managing Multiple Properties as a Small Landlord",
		slug: "L&PManagement/CompleteGuide",
		images: ["/BlogImages/L&PManagement/completeguide.png"],
		category: "Landlord & Portfolio Management",
		topics: ["Landlord & Portfolio Management"],
		description:
			"Learn how small landlords can stay organised and profitable while managing multiple properties. Discover how MyPropertyPal simplifies multi-property management.",
	},
	{
		title: "Is Property Management Software Worth It for Small Portfolios?",
		slug: "L&PManagement/Softwareforsmall",
		images: ["/BlogImages/L&PManagement/softwareeforsmall.png"],
		category: "Landlord & Portfolio Management",
		topics: ["Landlord & Portfolio Management"],
		description:
			"Discover why property management software is worth it for small landlords. Learn how MyPropertyPal simplifies rent, compliance, and tenant management.",
	},
	{
		title: "How to Easily Track Rent Payments Without Spreadsheets",
		slug: "L&PManagement/trackrent",
		images: ["/BlogImages/L&PManagement/trackrent.png"],
		category: "Landlord & Portfolio Management",
		topics: ["Landlord & Portfolio Management"],
		description:
			"Discover how landlords can track rent payments without spreadsheets. Learn how MyPropertyPal simplifies rent tracking and portfolio management.",
	},
	{
		title: "How to Handle Late Rent Payments Professionally",
		slug: "TenantAndCompliance/LateRent",
		images: ["/BlogImages/T&Comp/LateRent.png"],
		category: "Tenant & Compliance",
		topics: ["Tenant & Compliance"],
		description:
			"Learn how landlords can handle late rent payments professionally. Discover how MyPropertyPal simplifies rent tracking and tenant communication.",
	},
	{
		title: "How to Screen Tenants Properly (Without Breaking the Law)",
		slug: "TenantAndCompliance/TenantScreening",
		images: ["/BlogImages/T&Comp/tenant screening.png"],
		category: "Tenant & Compliance",
		topics: ["Tenant & Compliance"],
		description:
			"Learn how landlords can screen tenants effectively while staying compliant with legal guidelines. Discover how MyPropertyPal simplifies tenant screening.",
	},
	{
		title: "Landlords’ Legal Responsibilities in 2025",
		slug: "TenantAndCompliance/Legal",
		images: ["/BlogImages/T&Comp/legal.png"],
		category: "Tenant & Compliance",
		topics: ["Tenant & Compliance"],
		description:
			"Learn about landlords' legal responsibilities in 2025, including gas safety, EPCs, and deposit protection. Discover how MyPropertyPal simplifies compliance.",
	},
	{
		title: "What Landlords Need to Know About EPC Regulations",
		slug: "TenantAndCompliance/EPC",
		images: ["/BlogImages/T&Comp/EPC.png"],
		category: "Tenant & Compliance",
		topics: ["Tenant & Compliance"],
		description:
			"Learn about EPC regulations for landlords, including legal requirements, MEES standards, and compliance deadlines. Discover how MyPropertyPal simplifies EPC tracking.",
	},
	{
		title: "5 Property Management Tools Every Landlord Should Be Using",
		slug: "Investment&Growth/5Tools",
		images: ["/BlogImages/investment&growth/5tools.png"],
		category: "Investment & Growth",
		topics: ["Investment & Growth"],
		description:
			"Discover five essential property management tools every landlord should be using. Learn how MyPropertyPal simplifies property management and tenant communication.",
	},
	{
		title: "How to Increase Rental Yield Without Raising Rent",
		slug: "Investment&Growth/increaseyeildwithoutrent",
		images: ["/BlogImages/investment&growth/increaseyieldwithoutrent.png"],
		category: "Investment & Growth",
		topics: ["Investment & Growth"],
		description:
			"Discover smarter ways to increase rental yield without raising rent. Learn how MyPropertyPal helps landlords reduce voids, cut costs, and stay compliant.",
	},
	{
		title: "Is 2025 Still a Good Year to Invest in Buy-to-Let Property?",
		slug: "Investment&Growth/buy-to-letin2025",
		images: ["/BlogImages/investment&growth/buy-to-let2025.png"],
		category: "Investment & Growth",
		topics: ["Investment & Growth"],
		description:
			"Discover why 2025 is still a good year to invest in buy-to-let property. Learn how MyPropertyPal helps landlords succeed with rental properties.",
	},
	{
		title: "The Pros and Cons of Self-Managing Your Properties vs. Using an Agent",
		slug: "Investment&Growth/pros&cons",
		images: ["/BlogImages/investment&growth/pros&cons.png"],
		category: "Investment & Growth",
		topics: ["Investment & Growth"],
		description:
			"Discover the pros and cons of self-managing your properties vs. using an agent. Learn how MyPropertyPal simplifies self-management for landlords.",
	},
];

const topics = [
	"Tenant & Compliance",
	"Tax & Finance",
	"Landlord & Portfolio Management",
	"Investment & Growth",
];

function BlogSlider({ images }) {
	return (
		<div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-lg">
			<Image
				src={images[0]} // Always show the first image
				alt="Blog thumbnail"
				width={800}
				height={600}
				className="object-cover w-full h-full"
				priority
			/>
		</div>
	);
}

export default function Blog() {
	const [searchQuery, setSearchQuery] = useState("");

	// Updated filtering logic to include both title and category
	const filteredBlogs = searchQuery
		? blogPosts.filter(
				(blog) =>
					blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					blog.category.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: blogPosts;

	const rowRefs = useRef({}); // Store refs for each row

	const scrollRow = (topic, direction) => {
		const row = rowRefs.current[topic];
		if (row) {
			const scrollAmount = direction === "left" ? -320 : 320; // Adjust scroll amount to match card width
			row.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<div className="bg-white text-[#171717] font-sans">
			<Head>
				<title>Blog | MyPropertyPal</title>
				<meta
					name="description"
					content="Explore our latest blog posts on property management, compliance, and more."
				/>
				<meta name="robots" content="index, follow" />
				<meta property="og:title" content="Blog | MyPropertyPal" />
				<meta
					property="og:description"
					content="Explore our latest blog posts on property management, compliance, and more."
				/>
				<meta property="og:image" content="/LogoWB.png" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Blog | MyPropertyPal" />
				<meta
					name="twitter:description"
					content="Explore our latest blog posts on property management, compliance, and more."
				/>
				<meta name="twitter:image" content="/LogoWB.png" />
				<link rel="icon" href="/LogoWB.png" />
			</Head>

			{/* Headers */}
			<div className="hidden md:block">
				<DesktopHeader />
			</div>
			<div className="block md:hidden">
				<MobileHeader />
			</div>

			{/* Intro Section */}
			<section className="max-w-4xl mx-auto text-center py-16 px-4">
				<h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#2563eb]">
					Insights for Landlords
				</h1>
				<p className="text-lg text-gray-700 max-w-2xl mx-auto">
					Stay informed with our latest articles on property management,
					compliance, and more.
				</p>
			</section>

			{/* Search Bar */}
			<section className="max-w-7xl mx-auto py-4 px-4">
				<input
					type="text"
					placeholder="Search blogs by title or category..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full max-w-2xl mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
				/>
			</section>

			{/* Blog Rows by Topic */}
			{topics.map((topic) => (
				<section key={topic} className="max-w-7xl mx-auto py-10 px-4">
					<h2 className="text-2xl font-bold text-[#2563eb] mb-4 text-center">
						{topic}
					</h2>
					<div
						className="flex gap-6 overflow-hidden"
						ref={(el) => (rowRefs.current[topic] = el)}
					>
						{filteredBlogs
							.filter((blog) => blog.topics.includes(topic))
							.map((blog) => (
								<Link
									key={blog.slug}
									href={`/blog/posts/${blog.slug}`}
									className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-200 overflow-hidden"
								>
									<BlogSlider images={blog.images} />
									<div className="p-4">
										<span className="text-sm font-medium text-[#2563eb]">
											{blog.category}
										</span>
										<h3 className="text-lg font-bold mt-2 text-gray-800 group-hover:text-[#2563eb] transition">
											{blog.title}
										</h3>
										<p className="text-sm text-gray-600 mt-2">
											{blog.description}
										</p>
									</div>
								</Link>
							))}
					</div>
					{/* Chevron Controls */}
					<div className="flex justify-center gap-4 mt-4">
						<button
							onClick={() => scrollRow(topic, "left")}
							className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
							aria-label={`Scroll ${topic} row left`}
						>
							<HiChevronLeft size={24} />
						</button>
						<button
							onClick={() => scrollRow(topic, "right")}
							className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
							aria-label={`Scroll ${topic} row right`}
						>
							<HiChevronRight size={24} />
						</button>
					</div>
				</section>
			))}

			{/* Footer */}
			<Footer />
		</div>
	);
}