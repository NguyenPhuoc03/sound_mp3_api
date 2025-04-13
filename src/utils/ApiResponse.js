const { StatusCodes } = require("http-status-codes");

class ApiResponse {
  static success(
    res,
    statusCode = StatusCodes.OK,
    message = "Success",
    data = null
  ) {
    return res.status(statusCode).json({
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
  static failed(
    res,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message = "Failed",
    stack = null
  ) {
    const errorResponse = {
      statusCode,
      message,
      stack,
      timestamp: new Date().toISOString(),
    };

    //@ xác định nếu môi trường debug thì mới in ra stack
    // if (process.env.NODE_ENV !== 'production' && stack) {
    //   errorResponse.stack = stack;
    // }

    return res.status(statusCode).json(errorResponse);
  }
}

module.exports = ApiResponse;
