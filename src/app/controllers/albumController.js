const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Album = require("../models/Album");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class AlbumController {
  //! [POST] /album/create
  async createAlbum(req, res, next) {
    try {
      const insertData = req.body;
      const newAlbum = new Album(insertData);
      await newAlbum.save();

      ApiResponse.success(
        res,
        StatusCodes.CREATED,
        "Create successful album",
        newAlbum
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /album/get-all
  async getAlbums(req, res, next) {
    try {
      const albums = await Album.find({});

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get list of albums successfully",
        albums
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /album/:albumId
  async getAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID");
      }

      const album = await Album.findById(albumId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get album by id successfully",
        album
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [PATCH] /album/:albumId
  async updateAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;
      const updateData = req.body;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID");
      }

      const newAlbum = await Album.findByIdAndUpdate(albumId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newAlbum);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] /album/:albumId
  async deleteAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID");
      }

      const result = await Album.findByIdAndDelete(albumId);

      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cannot be deleted");
      }

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Album deleted successfully",
        result
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new AlbumController();
