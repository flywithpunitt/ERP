import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with trimmed values
const config = {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
	api_key: process.env.CLOUDINARY_API_KEY?.trim(),
	api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
	secure: true,
};

console.log("Cloudinary config:", {
	cloud_name: config.cloud_name,
	api_key: config.api_key ? "***" : "missing",
	api_secret: config.api_secret ? "***" : "missing",
	api_secret_length: config.api_secret?.length
});

cloudinary.config(config);

export { cloudinary };
