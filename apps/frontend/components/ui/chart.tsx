"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ChartConfigEntry = {
	label: string;
	color: string;
};

export type ChartConfig = Record<string, ChartConfigEntry>;

const ChartConfigContext = React.createContext<ChartConfig | null>(null);

const useChartConfig = () => {
	const context = React.useContext(ChartConfigContext);

	if (!context) {
		throw new Error("Chart components must be used inside ChartContainer");
	}

	return context;
};

type ChartContainerProps = React.ComponentProps<"div"> & {
	config: ChartConfig;
};

export function ChartContainer({
	className,
	config,
	children,
	...props
}: ChartContainerProps) {
	const style = React.useMemo(() => {
		const cssVariables: Record<string, string> = {};

		for (const [key, value] of Object.entries(config)) {
			cssVariables[`--color-${key}`] = value.color;
		}

		return cssVariables as React.CSSProperties;
	}, [config]);

	return (
		<ChartConfigContext.Provider value={config}>
			<div
				className={cn("h-[300px] w-full", className)}
				style={style}
				{...props}
			>
				{children}
			</div>
		</ChartConfigContext.Provider>
	);
}

type TooltipItem = {
	name?: string;
	value?: number | string;
	dataKey?: string;
	color?: string;
	payload?: {
		fill?: string;
	};
};

type ChartTooltipContentProps = {
	active?: boolean;
	payload?: TooltipItem[];
	label?: string;
	className?: string;
	formatter?: (value: number, item: TooltipItem) => string;
};

export function ChartTooltipContent({
	active,
	payload,
	label,
	className,
	formatter,
}: ChartTooltipContentProps) {
	const config = useChartConfig();

	if (!active || !payload || payload.length === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-background px-3 py-2 shadow-sm",
				className,
			)}
		>
			{label ? <p className="mb-2 text-xs text-muted-foreground">{label}</p> : null}
			<div className="space-y-1.5">
				{payload.map((item) => {
					const key = item.dataKey || item.name || "value";
					const configItem = config[key];
					const value = Number(item.value || 0);
					const displayValue = formatter ? formatter(value, item) : value;
					const color = configItem?.color || item.color || item.payload?.fill || "#8884d8";

					return (
						<div key={`${key}-${item.name}`} className="flex items-center justify-between gap-3 text-xs">
							<div className="flex items-center gap-2">
								<span
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: color }}
								/>
								<span className="text-muted-foreground">{configItem?.label || item.name || key}</span>
							</div>
							<span className="font-medium text-foreground">{displayValue}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

type ChartLegendContentProps = {
	payload?: Array<{
		dataKey?: string;
		value?: string;
		color?: string;
	}>;
};

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
	const config = useChartConfig();

	if (!payload?.length) {
		return null;
	}

	return (
		<div className="mt-3 flex flex-wrap items-center gap-4">
			{payload.map((entry) => {
				const key = entry.dataKey || entry.value || "value";
				const configItem = config[key];

				return (
					<div key={key} className="flex items-center gap-2 text-xs">
						<span
							className="h-2 w-2 rounded-full"
							style={{ backgroundColor: configItem?.color || entry.color }}
						/>
						<span className="text-muted-foreground">
							{configItem?.label || entry.value || key}
						</span>
					</div>
				);
			})}
		</div>
	);
}
