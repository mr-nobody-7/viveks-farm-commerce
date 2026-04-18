declare module "next" {
	export interface Metadata {
		[key: string]: unknown;
	}

	export type NextConfig = Record<string, unknown>;
}

declare module "next/navigation" {
	export interface NavigateOptions {
		scroll?: boolean;
	}

	export interface PrefetchOptions {
		onInvalidate?: () => void;
	}

	export interface AppRouterInstance {
		push(href: string, options?: NavigateOptions): void;
		replace(href: string, options?: NavigateOptions): void;
		prefetch(href: string, options?: PrefetchOptions): void;
		back(): void;
		forward(): void;
		refresh(): void;
	}

	export function useRouter(): AppRouterInstance;
	export function usePathname(): string;
	export function useSearchParams(): URLSearchParams;
	export function useParams<T extends Record<string, string | string[]>>(): T;
	export function notFound(): never;
	export function redirect(url: string): never;
}

declare module "next/font/google" {
	type FontOptions = {
		subsets?: string[];
		variable?: string;
		weight?: string | string[];
		style?: string | string[];
		display?: string;
		preload?: boolean;
		fallback?: string[];
	};

	type FontResult = {
		className: string;
		variable: string;
		style: {
			fontFamily: string;
		};
	};

	export function Geist(options?: FontOptions): FontResult;
	export function Geist_Mono(options?: FontOptions): FontResult;
}

declare module "next/types.js" {
	export type ResolvingMetadata = unknown;
	export type ResolvingViewport = unknown;
}

declare module "*.css";
