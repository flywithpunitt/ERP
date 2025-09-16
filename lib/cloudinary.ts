import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with trimmed values
const config = {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
	api_key: process.env.CLOUDINARY_API_KEY?.trim(),
	api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
	secure: true,
};

// Debug logging removed for production

cloudinary.config(config);

export { cloudinary };
