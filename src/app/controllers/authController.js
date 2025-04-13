require("dotenv").config();

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class AuthController {
  //! [POST] auth/register
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // hash password
      const hashPassword = await bcrypt.hash(password, saltRounds);

      // create instance
      const newUser = new User({
        email: email,
        password: hashPassword,
        name: name,
      });
      const saveUser = await newUser.save();

      ApiResponse.success(
        res,
        StatusCodes.CREATED,
        "New account created successfully",
        saveUser
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [POST] auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });

      if (user) {
        // compare password
        const isMatchPassword = bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
          next(
            new ApiError(
              StatusCodes.UNAUTHORIZED,
              "Email or password is incorrect"
            )
          );
        } else {
          const payload = {
            email: user.email,
            name: user.name,
          };
          const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
          });
          
          const resData = {
            accessToken,
            user: {
              name: user.name,
              email: user.email,
            },
          };

          ApiResponse.success(
            res,
            StatusCodes.OK,
            "Login successful",
            resData
          );
        }
      } else {
        next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Email or password is incorrect"
          )
        );
      }
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }
}
module.exports = new AuthController();
