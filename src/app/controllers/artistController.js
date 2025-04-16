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
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
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
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /artist/:artistId
  async getArtistById(req, res, next) {
    try {
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      const artist = await Artist.findById(artistId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get artist by id successfully",
        artist
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [PATCH] /artist/:artistId
  async updateArtistById(req, res, next) {
    try {
      const { artistId } = req.params;
      const updateData = req.body;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      const newArtist = await Artist.findByIdAndUpdate(artistId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newArtist);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] /artist/:artistId
  async deleteArtistById(req, res, next) {
    try {
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      await Artist.findByIdAndDelete(artistId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Artist deleted successfully",
        null
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new ArtistController();
