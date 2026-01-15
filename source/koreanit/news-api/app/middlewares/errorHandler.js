const { fail } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  if (res.headersSent) return next(err);

  return fail(res, "서버 오류", 500, err.message);
}

module.exports = errorHandler;