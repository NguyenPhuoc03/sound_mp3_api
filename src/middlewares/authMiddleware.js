require("dotenv").config();

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const ApiError = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  // kiem tra token
  if (!token) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid or expired token");
  }

  //verify token
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    next(new ApiError(statusCode, error.message));
  }
};

module.exports = authMiddleware;
