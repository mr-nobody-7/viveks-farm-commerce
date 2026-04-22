import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { type ISavedAddress, User } from "../models/user.model";

const router = Router();

router.patch("/users/profile", requireAuth, async (req: AuthRequest, res) => {
	const { name } = req.body;

	const user = await User.findByIdAndUpdate(
		req.userId,
		{ name },
		{ new: true },
	).lean();

	res.json(user);
});

// Add a new address
router.post("/users/addresses", requireAuth, async (req: AuthRequest, res) => {
	const {
		label,
		fullName,
		phone,
		addressLine,
		city,
		state,
		pincode,
		isDefault,
	} = req.body as {
		label?: string;
		fullName?: string;
		phone?: string;
		addressLine?: string;
		city?: string;
		state?: string;
		pincode?: string;
		isDefault?: boolean;
	};

	const user = await User.findById(req.userId);
	if (!user) return res.status(404).json({ message: "User not found" });

	const makeDefault = isDefault === true || user.addresses.length === 0;

	if (makeDefault) {
		for (const addr of user.addresses) {
			addr.isDefault = false;
		}
	}

	user.addresses.push({
		label,
		fullName: fullName || "",
		phone: phone || "",
		addressLine: addressLine || "",
		city: city || "",
		state: state || "",
		pincode: pincode || "",
		isDefault: makeDefault,
	});

	await user.save();
	res.json(user);
});

// Update an address
router.patch(
	"/users/addresses/:id",
	requireAuth,
	async (req: AuthRequest, res) => {
		const { label, fullName, phone, addressLine, city, state, pincode } =
			req.body as {
				label?: string;
				fullName?: string;
				phone?: string;
				addressLine?: string;
				city?: string;
				state?: string;
				pincode?: string;
			};

		const user = await User.findById(req.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		const addr = user.addresses.id(req.params.id);
		if (!addr) return res.status(404).json({ message: "Address not found" });

		if (label !== undefined) addr.label = label;
		if (fullName !== undefined) addr.fullName = fullName;
		if (phone !== undefined) addr.phone = phone;
		if (addressLine !== undefined) addr.addressLine = addressLine;
		if (city !== undefined) addr.city = city;
		if (state !== undefined) addr.state = state;
		if (pincode !== undefined) addr.pincode = pincode;

		await user.save();
		res.json(user);
	},
);

// Delete an address
router.delete(
	"/users/addresses/:id",
	requireAuth,
	async (req: AuthRequest, res) => {
		const user = await User.findById(req.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.addresses.pull({ _id: req.params.id });

		// If no default address remains, set the first one as default
		if (
			user.addresses.length > 0 &&
			!user.addresses.some((a: ISavedAddress) => a.isDefault)
		) {
			user.addresses[0].isDefault = true;
		}

		await user.save();
		res.json(user);
	},
);

// Set address as default
router.patch(
	"/users/addresses/:id/default",
	requireAuth,
	async (req: AuthRequest, res) => {
		const user = await User.findById(req.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		for (const addr of user.addresses) {
			addr.isDefault = addr._id?.toString() === req.params.id;
		}

		await user.save();
		res.json(user);
	},
);

export default router;
