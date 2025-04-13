const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Song = require("../models/Song");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class SongController {
  //! [POST] /song/create
  async createSong(req, res, next) {
    try {
      const insertData = req.body;
      const newSong = new Song(insertData);
      await newSong.save();

      ApiResponse.success(
        res,
        StatusCodes.CREATED,
        "Create successful song",
        newSong
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [GET] /song/get-all
  async getSongs(req, res, next) {
    try {
      const songs = await Song.find({});

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get list of songs successfully",
        songs
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      const customError = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errMessage
      );
      next(customError);
    }
  }

  //! [GET] /song/:songId
  async getSongById(req, res, next) {
    try {
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID"));
      }

      const song = await Song.findById(songId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get song by id successfully",
        song
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [PATCH] /song/:songId
  async updateSongById(req, res, next) {
    try {
      const { songId } = req.params;
      const updateData = req.body;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID"));
      }

      const newSong = await Song.findByIdAndUpdate(songId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newSong);
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [DELETE] /song/:songId
  async deleteSongById(req, res, next) {
    try {
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID"));
      }

      await Song.findByIdAndDelete(songId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Song deleted successfully",
        null
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }
}
module.exports = new SongController();
