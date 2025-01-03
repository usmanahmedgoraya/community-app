// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

module.exports = cloudinary;
