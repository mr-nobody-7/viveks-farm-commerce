"use client";

import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
			<h2 className="text-2xl font-bold">Something went wrong!</h2>
			<p className="text-muted-foreground">
				We encountered an error while loading this page.
			</p>
			<div className="flex justify-center gap-4">
				<Button onClick={() => reset()}>Try Again</Button>
				<Button variant="outline" onClick={() => (window.location.href = "/")}>
					Go Home
				</Button>
			</div>
		</div>
	);
}
