const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Artist = require("../models/Artist");
const User = require("../models/User");
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

      const result = await Artist.findByIdAndDelete(artistId);

      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cannot be deleted");
      }

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Artist deleted successfully",
        result
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [POST] /artist/:artistId/follow
  async followArtist(req, res, next) {
    try {
      const userId = req.user.id;
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      const artist = await Artist.findById(artistId);
      const user = await User.findById(userId);

      //kiem tra ton tai artist hay user khong
      if (!artist || !user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User or Artist not found");
      }

      // kiem tra da follow chua
      if (user.likedArtists.includes(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Artist already followed");
      }

      // thuc hien follow
      user.likedArtists.push(artistId);
      await user.save();

      // Tăng lượt like
      artist.interested += 1;
      await artist.save();

      ApiResponse.success(res, StatusCodes.OK, "Follow artist successfully", null);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [POST] /artist/:artistId/unfollow
  async unfollowArtist(req, res, next) {
    try {
      const userId = req.user.id;
      const { artistId } = req.params;

      // validate artistId
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid artist ID");
      }

      const artist = await Artist.findById(artistId);
      const user = await User.findById(userId);

      if (!artist || !user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User or Artist not found");
      }

      // kiem tra co like khong
      const indexArtist = user.likedArtists.indexOf(artistId);
      if (indexArtist === -1) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Artist has not been followed yet"
        );
      }

      // thuc hien unfollow
      user.likedArtists.splice(indexArtist, 1);
      await user.save();

      // Tăng lượt like, tranh bi am
      artist.interested = Math.max(artist.interested - 1, 0);
      await artist.save();

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Unfollow artist successfully",
        null
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new ArtistController();
