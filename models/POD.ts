import mongoose, { Schema, Model, models } from "mongoose";

export type PODStatus = "pending" | "approved" | "rejected";

export interface IPOD {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	cloudinaryUrl: string;
	status: PODStatus;
	remarks?: string;
	createdAt: Date;
	updatedAt: Date;
}

const PODSchema = new Schema<IPOD>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		cloudinaryUrl: { type: String, required: true },
		status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
		remarks: { type: String, default: "" },
	},
	{ timestamps: true }
);

export const POD: Model<IPOD> = (models.POD as Model<IPOD>) || mongoose.model<IPOD>("POD", PODSchema);
