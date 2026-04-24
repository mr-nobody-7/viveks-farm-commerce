"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
	{
		id: 1,
		badge: "🧈 Bestseller",
		title: "A2 Bilona Ghee",
		subtitle: "Pure Tradition in Every Drop",
		description:
			"Hand-churned from A2 desi cow milk using the ancient Bilona method. Experience the richness our ancestors enjoyed.",
		cta: { label: "Shop Ghee", href: "/shop/ghee" },
		secondary: { label: "Learn More", href: "/about-us" },
		gradient: "from-amber-50 via-yellow-50 to-orange-50",
		accent: "bg-amber-100",
		textAccent: "text-amber-700",
		badge_bg: "bg-amber-100 text-amber-800",
		emoji: "🧈",
		stat1: { value: "A2 Milk", label: "Desi Cow" },
		stat2: { value: "Bilona", label: "Method" },
		stat3: { value: "0", label: "Additives" },
	},
	{
		id: 2,
		badge: "🫙 Handmade",
		title: "Traditional Pickles",
		subtitle: "Grandma's Secret Recipes",
		description:
			"Made with sun-dried vegetables, pure mustard oil, and age-old spice blends. Every jar bursts with authentic flavour.",
		cta: { label: "Shop Pickles", href: "/shop/pickles" },
		secondary: { label: "View All", href: "/shop" },
		gradient: "from-red-50 via-orange-50 to-amber-50",
		accent: "bg-red-100",
		textAccent: "text-red-700",
		badge_bg: "bg-red-100 text-red-800",
		emoji: "🫙",
		stat1: { value: "Sun", label: "Dried" },
		stat2: { value: "Pure Oil", label: "Mustard" },
		stat3: { value: "No", label: "Chemicals" },
	},
	{
		id: 3,
		badge: "🍯 Raw & Pure",
		title: "Forest Honey",
		subtitle: "Straight from the Hive",
		description:
			"100% raw, unfiltered, and unheated honey sourced from pristine forest beehives. Loaded with enzymes and antioxidants.",
		cta: { label: "Shop Honey", href: "/shop/honey" },
		secondary: { label: "Our Process", href: "/about-us" },
		gradient: "from-yellow-50 via-amber-50 to-yellow-100",
		accent: "bg-yellow-100",
		textAccent: "text-yellow-700",
		badge_bg: "bg-yellow-100 text-yellow-800",
		emoji: "🍯",
		stat1: { value: "Raw", label: "Unfiltered" },
		stat2: { value: "Forest", label: "Sourced" },
		stat3: { value: "Rich", label: "Enzymes" },
	},
	{
		id: 4,
		badge: "🫒 Cold-Pressed",
		title: "Cold Pressed Oils",
		subtitle: "Pressed Fresh, Not Refined",
		description:
			"Extracted using traditional wooden churners (Chekku) at low temperatures. Retains all natural nutrients and flavour.",
		cta: { label: "Shop Oils", href: "/shop/cold-pressed-oils" },
		secondary: { label: "Browse All", href: "/shop" },
		gradient: "from-green-50 via-emerald-50 to-teal-50",
		accent: "bg-green-100",
		textAccent: "text-green-700",
		badge_bg: "bg-green-100 text-green-800",
		emoji: "🫒",
		stat1: { value: "Chekku", label: "Method" },
		stat2: { value: "Cold", label: "Pressed" },
		stat3: { value: "No", label: "Refining" },
	},
];

const AUTO_INTERVAL = 4500;

export function HeroCarousel() {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const goTo = useCallback((idx: number) => {
		setCurrent((idx + slides.length) % slides.length);
	}, []);

	const next = useCallback(() => goTo(current + 1), [current, goTo]);
	const prev = useCallback(() => goTo(current - 1), [current, goTo]);

	useEffect(() => {
		if (paused) return;
		timerRef.current = setInterval(next, AUTO_INTERVAL);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [paused, next]);

	const handleDotClick = (idx: number) => {
		goTo(idx);
		// Restart timer
		if (timerRef.current) clearInterval(timerRef.current);
		setPaused(false);
	};

	return (
		<section
			aria-label="Featured products carousel"
			className="relative overflow-hidden"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* Slides */}
			<div
				className="flex transition-transform duration-700 ease-in-out"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{slides.map((slide) => (
					<div
						key={slide.id}
						className={`min-w-full bg-gradient-to-br ${slide.gradient} relative`}
					>
						<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
							<div className="max-w-2xl space-y-6">
								{/* Badge */}
								<span
									className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${slide.badge_bg}`}
								>
									{slide.badge}
								</span>

								{/* Headline */}
								<div>
									<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
										{slide.title}
									</h1>
									<p
										className={`text-xl md:text-2xl font-medium mt-2 ${slide.textAccent}`}
									>
										{slide.subtitle}
									</p>
								</div>

								{/* Description */}
								<p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
									{slide.description}
								</p>

								{/* Stats */}
								<div className="flex gap-6">
									{[slide.stat1, slide.stat2, slide.stat3].map((stat) => (
										<div
											key={stat.label}
											className={`rounded-xl px-4 py-2 ${slide.accent}`}
										>
											<p className="text-sm font-bold text-foreground">
												{stat.value}
											</p>
											<p className="text-xs text-muted-foreground">
												{stat.label}
											</p>
										</div>
									))}
								</div>

								{/* CTA */}
								<div className="flex flex-wrap gap-3 pt-1">
									<Button size="lg" asChild>
										<Link href={slide.cta.href}>{slide.cta.label}</Link>
									</Button>
									<Button size="lg" variant="outline" asChild>
										<Link href={slide.secondary.href}>
											{slide.secondary.label}
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Decorative large emoji */}
						<div
							aria-hidden="true"
							className="absolute right-10 bottom-0 text-[160px] md:text-[220px] leading-none opacity-20 pointer-events-none select-none hidden md:block"
						>
							{slide.emoji}
						</div>
					</div>
				))}
			</div>

			{/* Prev / Next arrows */}
			<button
				type="button"
				onClick={prev}
				aria-label="Previous slide"
				className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 backdrop-blur shadow hover:bg-background transition-colors"
			>
				<ChevronLeft className="h-5 w-5" />
			</button>
			<button
				type="button"
				onClick={next}
				aria-label="Next slide"
				className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 backdrop-blur shadow hover:bg-background transition-colors"
			>
				<ChevronRight className="h-5 w-5" />
			</button>

			{/* Dot indicators */}
			<div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
				{slides.map((s, idx) => (
					<button
						key={s.id}
						type="button"
						aria-label={`Go to slide ${idx + 1}`}
						onClick={() => handleDotClick(idx)}
						className={`h-2.5 rounded-full transition-all duration-300 ${
							idx === current
								? "w-8 bg-primary"
								: "w-2.5 bg-foreground/20 hover:bg-foreground/40"
						}`}
					/>
				))}
			</div>

			{/* Progress bar */}
			{!paused && (
				<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/10">
					<div
						key={current}
						className="h-full bg-primary/60 animate-[progress_4.5s_linear_forwards]"
						style={{ animationDuration: `${AUTO_INTERVAL}ms` }}
					/>
				</div>
			)}
		</section>
	);
}
