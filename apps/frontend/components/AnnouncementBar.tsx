"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AnnouncementBar() {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="relative bg-primary text-primary-foreground text-sm py-2 px-4 text-center">
			<p>
				🌿 Free delivery on orders above ₹500 &nbsp;·&nbsp;{" "}
				<Link href="/shop" className="underline underline-offset-2 font-medium">
					Shop Now
				</Link>
			</p>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
				aria-label="Dismiss announcement"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
