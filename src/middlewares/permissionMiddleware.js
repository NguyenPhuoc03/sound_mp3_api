const { StatusCodes } = require("http-status-codes");

const ApiError = require("../utils/ApiError");

const permissionMiddleware = (req, res, next) => {
  const userRole = req.user?.role;
  console.log("dd", userRole);

  if (userRole !== "admin") {
    next(new ApiError(StatusCodes.FORBIDDEN, "You do not have access."));
  }
  next();
};

module.exports = permissionMiddleware;
