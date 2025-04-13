const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class UserController {
  //! [POST] /register
  // async register(req, res, next) {
  //   try {
  //     const insertData = req.body;

  //     // hash password
  //     insertData.password = await bcrypt.hash(insertData.password, saltRounds,);

  //     // create instance
  //     const newUser = new User(insertData);
  //     const saveUser = await newUser.save();

  //     ApiResponse.success(
  //       res,
  //       StatusCodes.CREATED,
  //       "New account created successfully",
  //       saveUser
  //     );
  //   } catch (error) {
  //     const errMessage = new Error(error).message;
  //     next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
  //   }
  // }
}
module.exports = new UserController();
