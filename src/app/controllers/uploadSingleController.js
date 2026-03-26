const cloudinary = require("../../config/cloudinary");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No files were uploaded!");
    }

    const folderName = req.body.folder || "others";

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `SoundMP3/${folderName}`,
      resource_type: "auto",
    });
    const uploadData = {
      url: result.secure_url,
      duration: result.duration ? Math.round(result.duration) : 0,
    };

    return ApiResponse.success(
      res,
      StatusCodes.OK,
      "Upload successfully!",
      uploadData,
    );
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    next(new ApiError(statusCode, error.message));
  }
};

module.exports = {
  uploadSingle,
};
