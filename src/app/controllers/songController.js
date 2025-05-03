const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Song = require("../models/Song");
const User = require("../models/User");
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
      const songs = await Song.find({}).populate({
        path: "artists",
        select: "name -_id",
      });

      // Chuyển artists thành mảng chuỗi tên
    const simplifiedSongs = songs.map(song => ({
      ...song.toObject(),
      artists: song.artists.map(artist => artist.name) // Lấy tên nghệ sĩ
    }));

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Get list of songs successfully",
        simplifiedSongs
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

      const songs = await Song.find({ artists: artistId });

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
  async getSongByAlbumId(req, res, next) {
    try {
      const { albumId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid album ID");
      }

      const songs = await Song.find({ album: albumId });

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

  //! [POST] /song/:songId/like
  async likeSong(req, res, next) {
    try {
      const userId = req.user.id;
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID");
      }

      const song = await Song.findById(songId);
      const user = await User.findById(userId);

      //kiem tra ton tai song hay user khong
      if (!song || !user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User or Song not found");
      }

      // kiem tra da like chua
      if (user.likedSongs.includes(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Song already liked");
      }

      // thuc hien like
      user.likedSongs.push(songId);
      await user.save();

      // Tăng lượt like
      song.interested += 1;
      await song.save();

      ApiResponse.success(res, StatusCodes.OK, "Like song successfully", null);
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }

  //! [POST] /song/:songId/unlike
  async unlikeSong(req, res, next) {
    try {
      const userId = req.user.id;
      const { songId } = req.params;

      // validate songId
      if (!mongoose.Types.ObjectId.isValid(songId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid song ID");
      }

      const song = await Song.findById(songId);
      const user = await User.findById(userId);

      //kiem tra ton tai song hay user khong
      if (!song || !user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User or Song not found");
      }

      // kiem tra co like khong
      const indexSong = user.likedSongs.indexOf(songId);
      if (indexSong === -1) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Song has not been liked yet"
        );
      }

      // thuc hien like
      user.likedSongs.splice(indexSong, 1);
      await user.save();

      // Tăng lượt like, tranh bi am
      song.interested = Math.max(song.interested - 1, 0);
      await song.save();

      ApiResponse.success(
        res,
        StatusCodes.OK,
        "Unlike song successfully",
        null
      );
    } catch (error) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      next(new ApiError(statusCode, error.message));
    }
  }
}
module.exports = new SongController();
