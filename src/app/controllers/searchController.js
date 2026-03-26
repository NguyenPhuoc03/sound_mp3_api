const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Song = require("../models/Song");
const User = require("../models/User");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const { removeVietnameseTones } = require("../../utils/stringHandler");
const { formatSongResponse } = require("../../utils/responseSongFormatter");

class SearchController {
  //! [GET] /search?query=key
  async search(req, res, next) {
    try {
      const keyword = req.query.keyword?.trim();
      //xoa ki tu, hoa thuong
      const keywordUnsigned = removeVietnameseTones(keyword);

      if (!keywordUnsigned) {
        return ApiResponse.success(res, StatusCodes.OK, "Success", []);
      }

      const regexStart = new RegExp(`^${keywordUnsigned}`, "i");
      const regexContain = new RegExp(keywordUnsigned, "i");

      const songs = await Song.find({
        $or: [{ title_unsigned: regexStart }, { title_unsigned: regexContain }],
      })
        .populate("artists", "name")
        .limit(10);

      const simplifiedSongs = songs.map(formatSongResponse);

      ApiResponse.success(res, StatusCodes.OK, "Success", simplifiedSongs);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new SearchController();
