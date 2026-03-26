const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
    "audio/mp3",
  ];

  // Kiểm tra bằng đuôi mở rộng của tên file 
  const allowedExtensions = [
    ".jpeg",
    ".jpg",
    ".png",
    ".webp",
    ".mp3",
    ".wav",
    ".mpeg",
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  const isMimetypeValid = allowedMimetypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.includes(ext);
  if (isMimetypeValid || isExtensionValid) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận audio và image"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
