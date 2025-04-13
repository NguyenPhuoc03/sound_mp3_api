require("dotenv").config();

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const ApiError = require("../utils/ApiError");

const auth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode:", decode);

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }
  } else {
    next(new ApiError(StatusCodes.FORBIDDEN, "No token provided."));
  }
};

module.exports = auth;
