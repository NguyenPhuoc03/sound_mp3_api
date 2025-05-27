const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const History = require("../models/History");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

class HistoryController {
  constructor() {
    // Bind this cho các phương thức
    this.getHistorySongs = this.getHistorySongs.bind(this);
    this.getSongs = this.getSongs.bind(this);
  }
  //! [POST] /history/create
  async createHistorySong(req, res, next) {
    try {
      const { id } = req.user;
      const { song } = req.body;

      const last = await History.findOne({ user: id }).sort({ createdAt: -1 });

      if (last && last.song.toString() === song) {
        return ApiResponse.success(
          res,
          StatusCodes.OK,
          "No need to add duplicate song history",
          last
        );
      }
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

  //! [GET] /history/get-all
  async getHistorySongs(req, res, next) {
    const { id } = req.user;
    const todayOffset = parseInt(req.query.todayOffset || 0);
    const yesterdayOffset = parseInt(req.query.yesterdayOffset || 0);
    const otherOffset = parseInt(req.query.otherOffset || 0);
    const limit = 5;

    const now = new Date();
    const startToday = new Date(now.setHours(0, 0, 0, 0));
    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);
    const startOther = new Date(startYesterday);
    startOther.setDate(startOther.getDate() - 1);

    const today = await this.getSongs(
      id,
      startToday,
      new Date(),
      todayOffset,
      limit
    );
    const yesterday = await this.getSongs(
      id,
      startYesterday,
      startToday,
      yesterdayOffset,
      limit
    );
    const other = await this.getSongs(
      id,
      new Date(0),
      startOther,
      otherOffset,
      limit
    );

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Get successful listening history",
      { today, yesterday, other }
    );
  }

  async getSongs(userId, from, to, offset, limit) {
    try {
      // Tìm kiếm các bài hát trong khoảng thời gian từ `from` đến `to` cho userId nhất định
      const items = await History.find({
        user: userId,
        listenedAt: { $gte: from, $lt: to },
      })
        .sort({ listenedAt: -1 }) // Lưu ý sửa lại tên trường nếu cần
        .skip(offset)
        .limit(limit)
        .populate({
          path: "song",
          populate: {
            path: "artists",
            select: "name -_id", // Chỉ lấy tên nghệ sĩ
          },
        });

      // Chuyển artists thành mảng tên cho mỗi bài hát
      const simplifiedItems = items.map((historyItem) => {
        const song = historyItem.song;
        const artists = song.artists.map((artist) => artist.name);
        return {
          ...historyItem.toObject(),
          song: {
            ...song.toObject(),
            artists, // Gán mảng tên nghệ sĩ
          },
        };
      });

      // Lấy tổng số bản ghi trong khoảng thời gian đó
      const total = await History.countDocuments({
        user: userId,
        listenedAt: { $gte: from, $lt: to },
      });

      return {
        simplifiedItems,
        hasMore: offset + items.length < total,
        offset: offset + items.length,
      };
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [DELETE] /history/:historyId
  async deleteHistorySong(req, res, next) {
    try {
      const { id } = req.user;
      const { historyId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(historyId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid history ID");
      }

      const result = await History.deleteOne({ _id: historyId, user: id });

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
