const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_NAME ||
    "b4c8jnri",
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_KEY ||
    "725971422557953",
  api_secret:
    process.env.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_SECRET ||
    "9u3BMYAj4BQ4nRuH_D3RpTr_l_4",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nearme_stories",
    allowedFormats: ["jpg", "png", "jpeg", "webp", "gif", "mp4"],
    resource_type: "auto", // allows both images and videos
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

module.exports = { cloudinary, upload };
