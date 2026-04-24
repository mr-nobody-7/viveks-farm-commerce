import {
	Leaf,
	Mail,
	MessageCircle,
	Phone,
	Shield,
	Star,
	Truck,
} from "lucide-react";
import Link from "next/link";

const footerCategories = [
	{ name: "Ghee", slug: "ghee" },
	{ name: "Pickles", slug: "pickles" },
	{ name: "Honey", slug: "honey" },
	{ name: "Sweets", slug: "sweets" },
	{ name: "Cold-Pressed Oils", slug: "cold-pressed-oils" },
	{ name: "Spices", slug: "spices" },
];

const trustBadges = [
	{ icon: Shield, label: "FSSAI Certified" },
	{ icon: Star, label: "4.9★ Rated" },
	{ icon: Truck, label: "Pan-India Delivery" },
];

export const Footer = () => {
	return (
		<footer className="w-full border-t bg-secondary/50">
			{/* Trust badges strip */}
			<div className="border-b bg-background">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
						{trustBadges.map((b) => (
							<div key={b.label} className="flex items-center gap-2">
								<b.icon className="h-4 w-4 text-primary shrink-0" />
								<span>{b.label}</span>
							</div>
						))}
						<div className="flex items-center gap-2">
							<span className="text-base">🌿</span>
							<span>No Preservatives</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-base">🤝</span>
							<span>100% Authentic</span>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Leaf className="h-6 w-6 text-primary" />
							<span className="text-lg font-bold">Vivek's Farm</span>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Fresh from our farm to your table. Pure, natural, and handmade
							with love since 2018.
						</p>
						<div className="flex gap-3">
							<a
								href="https://wa.me/918985046761"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
								aria-label="WhatsApp"
							>
								<MessageCircle className="h-4 w-4" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-semibold mb-3">Quick Links</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/" className="hover:text-primary transition-colors">
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/shop"
									className="hover:text-primary transition-colors"
								>
									Shop All Products
								</Link>
							</li>
							<li>
								<Link
									href="/about-us"
									className="hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact-us"
									className="hover:text-primary transition-colors"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="hover:text-primary transition-colors"
								>
									My Cart
								</Link>
							</li>
							<li>
								<Link
									href="/profile/orders"
									className="hover:text-primary transition-colors"
								>
									Track Orders
								</Link>
							</li>
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h4 className="font-semibold mb-3">Categories</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{footerCategories.map((cat) => (
								<li key={cat.slug}>
									<Link
										href={`/shop/${cat.slug}`}
										className="hover:text-primary transition-colors"
									>
										{cat.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="font-semibold mb-3">Get in Touch</h4>
						<div className="space-y-3 text-sm text-muted-foreground">
							<a
								href="tel:+918985046761"
								className="flex items-center gap-2 hover:text-primary transition-colors"
							>
								<Phone className="h-4 w-4 shrink-0" />
								+91 89850 46761
							</a>
							<a
								href="mailto:hello@viveksfarm.com"
								className="flex items-center gap-2 hover:text-primary transition-colors"
							>
								<Mail className="h-4 w-4 shrink-0" />
								hello@viveksfarm.com
							</a>
							<a
								href="https://wa.me/918985046761"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-primary hover:underline"
							>
								<MessageCircle className="h-4 w-4" />
								Chat on WhatsApp
							</a>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Vivek's Farm. All rights reserved.</p>
					<p>Made with ❤️ for farm-fresh living</p>
				</div>
			</div>
		</footer>
	);
};
