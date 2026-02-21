"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";

interface LoginModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
	const [mobile, setMobile] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState<"mobile" | "otp">("mobile");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const setUser = useAuthStore((state) => state.setUser);

	const handleRequestOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await api.requestOTP(mobile);
			setStep("otp");
			// In development, show OTP (remove in production)
			if (process.env.NODE_ENV === "development" && response.otp) {
				// OTP will be visible in backend logs
			}
		} catch (err) {
			setError("Failed to send OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await api.verifyOTP(mobile, otp);
			setUser(response.user);
			onOpenChange(false);
			// Reset form
			setMobile("");
			setOtp("");
			setStep("mobile");
		} catch (err) {
			setError("Invalid OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleBack = () => {
		setStep("mobile");
		setOtp("");
		setError("");
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
							: `We've sent a 6-digit OTP to ${mobile}`}
					</DialogDescription>
				</DialogHeader>

				{step === "mobile" ? (
					<form onSubmit={handleRequestOTP} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="mobile">Mobile Number</Label>
							<Input
								id="mobile"
								type="tel"
								placeholder="+91 98765 43210"
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
