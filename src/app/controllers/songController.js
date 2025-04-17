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
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
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
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /song/:songId
  async getSongById(req, res, next) {
    try {
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID");
      }

      const song = await Song.findById(songId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get song by id successfully",
        song
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /artist/:artistId/songs
  async getSongByArtistId(req, res, next) {
    try {
      const { artistId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      const songs = await Song.find({ artists: artistId })

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get song by artist id successfully",
        songs
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /album/:albumId/songs
  async getSongByArtistId(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID");
      }

      const songs = await Song.find({ album: albumId })

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get song by album id successfully",
        songs
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
  

  //! [PATCH] /song/:songId
  async updateSongById(req, res, next) {
    try {
      const { songId } = req.params;
      const updateData = req.body;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID");
      }

      const newSong = await Song.findByIdAndUpdate(songId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newSong);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] /song/:songId
  async deleteSongById(req, res, next) {
    try {
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID");
      }

      const result = await Song.findByIdAndDelete(songId);

      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cannot be deleted");
      }

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Song deleted successfully",
        result
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new SongController();
