"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";

const RESEND_COOLDOWN = 30;

interface LoginModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
	const [mobile, setMobile] = useState("");
	const [otp, setOtp] = useState("");
	const [devOtp, setDevOtp] = useState<string | null>(null);
	const [step, setStep] = useState<"mobile" | "otp">("mobile");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [resendCountdown, setResendCountdown] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const setUser = useAuthStore((state) => state.setUser);

	const startResendTimer = () => {
		setResendCountdown(RESEND_COOLDOWN);
		timerRef.current = setInterval(() => {
			setResendCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current ?? undefined);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	const sendOtp = async (mobileNumber: string) => {
		setError("");
		setLoading(true);
		try {
			const response = await api.requestOTP(mobileNumber);
			setDevOtp(response.devOtp ?? null);
			setStep("otp");
			startResendTimer();
		} catch {
			setError("Failed to send OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleRequestOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		await sendOtp(mobile);
	};

	const handleResendOTP = async () => {
		await sendOtp(mobile);
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await api.verifyOTP(mobile, otp);
			setUser(response.user);
			onOpenChange(false);
			setMobile("");
			setOtp("");
			setDevOtp(null);
			setStep("mobile");
			setResendCountdown(0);
		} catch {
			setError("Invalid OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleBack = () => {
		setStep("mobile");
		setOtp("");
		setDevOtp(null);
		setError("");
		setResendCountdown(0);
		if (timerRef.current) clearInterval(timerRef.current);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{step === "mobile" ? "Login with Mobile" : "Enter OTP"}
					</DialogTitle>
					<DialogDescription>
						{step === "mobile"
							? "Enter your mobile number to receive an OTP"
							: `We've sent a 6-digit OTP to +91 ${mobile}`}
					</DialogDescription>
				</DialogHeader>

				{step === "mobile" ? (
					<form onSubmit={handleRequestOTP} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="mobile">Mobile Number</Label>
							<Input
								id="mobile"
								type="tel"
								placeholder="10-digit mobile number"
								value={mobile}
								onChange={(e) => setMobile(e.target.value)}
								required
								pattern="[0-9]{10}"
								maxLength={10}
								disabled={loading}
							/>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending OTP...
								</>
							) : (
								"Send OTP"
							)}
						</Button>
					</form>
				) : (
					<form onSubmit={handleVerifyOTP} className="space-y-4">
						{devOtp && (
							<div className="rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-900">
								<span className="font-medium">Demo OTP:</span> {devOtp}
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="otp">OTP</Label>
							<Input
								id="otp"
								type="text"
								placeholder="Enter 6-digit OTP"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								required
								pattern="[0-9]{6}"
								maxLength={6}
								disabled={loading}
								autoFocus
							/>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<div className="text-center">
							{resendCountdown > 0 ? (
								<p className="text-sm text-muted-foreground">
									Resend OTP in {resendCountdown}s
								</p>
							) : (
								<Button
									type="button"
									variant="link"
									size="sm"
									onClick={handleResendOTP}
									disabled={loading}
									className="h-auto p-0 text-sm"
								>
									Resend OTP
								</Button>
							)}
						</div>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleBack}
								disabled={loading}
								className="flex-1"
							>
								Back
							</Button>
							<Button type="submit" className="flex-1" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Verifying...
									</>
								) : (
									"Verify OTP"
								)}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};
