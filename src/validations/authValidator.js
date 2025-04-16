const validator = require("validator");
const { StatusCodes } = require("http-status-codes");

const User = require("../app/models/User");
const ApiError = require("../utils/ApiError");

const validateEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Please enter a valid email address."
      )
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email is already in use.");
    }
    next();
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    next(new ApiError(statusCode, error.message));
  }
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Password must be at least 6 characters."
      )
    );
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return next(
      new ApiError(StatusCodes.BAD_REQUEST, "Name must not be empty.")
    );
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
};
