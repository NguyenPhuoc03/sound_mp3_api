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
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
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
      const errMessage = new Error(error).message;
      const customError = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errMessage
      );
      next(customError);
    }
  }

  //! [GET] /album/:albumId
  async getAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID"));
      }

      const album = await Album.findById(albumId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get album by id successfully",
        album
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [PATCH] /album/:albumId
  async updateAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;
      const updateData = req.body;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID"));
      }

      const newAlbum = await Album.findByIdAndUpdate(albumId, updateData, {
        new: true,
      });

      ApiResponse.success(res, StatusCodes.OK, "Update successful", newAlbum);
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }

  //! [DELETE] /album/:albumId
  async deleteAlbumById(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate albumId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID"));
      }

      await Album.findByIdAndDelete(albumId);

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Album deleted successfully",
        null
      );
    } catch (error) {
      const errMessage = new Error(error).message;
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMessage));
    }
  }
}
module.exports = new AlbumController();
