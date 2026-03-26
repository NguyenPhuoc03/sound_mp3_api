// src/routes/upload.route.js
const express = require("express");

const router = express.Router();
const upload = require("../../middlewares/upload");
const cloudinary = require("cloudinary").v2;
const { uploadSingle } = require('../../app/controllers/uploadSingleController');

router.post("/single", upload.single("file"), uploadSingle);

module.exports = router;
