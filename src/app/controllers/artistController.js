const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Artist = require("../models/Artist");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class ArtistController {
  //! [POST] /artist/create
  async createArtist(req, res, next) {
    try {
      const insertData = req.body;
      const artist = new Artist(insertData);
      await artist.save();

      ApiResponse.success(
        res,
        StatusCodes.CREATED,
        "Create successful artist",
        artist
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [GET] /artist/get-all
  async getArtists(req, res, next) {
    try {
      const artists = await Artist.find({});

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get list of artists successfully",
        artists
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

  //! [GET] /artist/:artistId
  async getArtistById(req, res, next) {
    try {
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID"));
      }

      const artist = await Artist.findById(artistId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get artist by id successfully",
        artist
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [PATCH] /artist/:artistId
  async updateArtistById(req, res, next) {
    try {
      const { artistId } = req.params;
      const updateData = req.body;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID"));
      }

      const newArtist = await Artist.findByIdAndUpdate(artistId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newArtist);
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [DELETE] /artist/:artistId
  async deleteArtistById(req, res, next) {
    try {
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID"));
      }

      await Artist.findByIdAndDelete(artistId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Artist deleted successfully",
        null
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }
}
module.exports = new ArtistController();
