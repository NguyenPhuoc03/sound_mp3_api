const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class UserController {
  //! [GET] user/profile
  async profile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      ApiResponse.success(res, StatusCodes.OK, "Get user successfully", user);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [PATCH] user/update-user
  async updateUser(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const newUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newUser);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] user/delete-user
  async deleteUser(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      const result = await User.findByIdAndDelete(userId);

      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cannot be deleted");
      }

      ApiResponse.success(res, StatusCodes.OK, "Deleted successfully", result);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}

module.exports = new UserController();
