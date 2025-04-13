const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/authController");
const {
  validateEmail,
  validatePassword,
  validateName,
} = require("../validations/authValidator");

router.post(
  "/register",
  validateEmail,
  validatePassword,
  validateName,
  authController.register
);

router.post(
  "/login",
  authController.login
);

module.exports = router;
