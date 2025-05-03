require("dotenv").config();

const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class AuthController {
  //! [POST] auth/register
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      
      // hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT)
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
        null
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [POST] auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email }).select("+password");

      // khong tim thấy user
      if (!user) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email or password is incorrect"
        );
      }

      // compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email or password is incorrect"
        );
      } else {
        const payload = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        const resData = {
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };

        ApiResponse.success(res, StatusCodes.OK, "Login successful", resData);
      }
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new AuthController();
