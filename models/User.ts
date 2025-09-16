import mongoose, { Schema, Model, models } from "mongoose";

export type UserRole = "driver" | "admin";

export interface IUser {
	_id: mongoose.Types.ObjectId;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ["driver", "admin"], default: "driver" },
	},
	{ timestamps: true }
);

export const User: Model<IUser> = (models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
