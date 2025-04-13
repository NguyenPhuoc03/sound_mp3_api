const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("../utils/ApiResponse");

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
const errorHandlingMiddleware = (err, req, res, next) => {
  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Tạo ra một biến message, nếu thiếu thì sử dụng statusCode
  const message = err.message || StatusCodes[err.statusCode];

  // Trả responseError về phía Front-end
  ApiResponse.failed(res, err.statusCode, message, err.stack);
};

module.exports = { errorHandlingMiddleware };
