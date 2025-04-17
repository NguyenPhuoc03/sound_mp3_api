const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const History = require("../models/History");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class HistoryController {
  //! [POST] /history/create
  async createHistorySong(req, res, next) {
    try {
      const { id } = req.user;
      const { song } = req.body;
      const newHistory = new History({
        user: id,
        song: song,
      });
      await newHistory.save();

      ApiResponse.success(
        res,
        StatusCodes.CREATED,
        "Create a successful listening history",
        newHistory
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [GET] /history?skip=0&limit=5
  async getHistorySongs(req, res, next) {
    try {
      const { id } = req.user;

      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 7;

      const history = await History.find({ user: id })
        .sort({ listenedAt: -1 }) // sap xep tu moi den cu
        .skip(skip)
        .limit(limit)
        .populate("song"); // tra ve song thay vi song id

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get successful listening history",
        history
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] /history/:historyId
  async deleteHistorySong(req, res, next) {
    try {
      const {id} = req.user;
      const { historyId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(historyId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid history ID");
      }

      const result = await History.deleteOne({_id: historyId, user: id, });

      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cannot be deleted");
      }

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "History deleted successfully",
        result
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new HistoryController();
