const { fail } = require("../utils/response");

function notFound(req, res, next) {
  return fail(res, "존재하지 않는 API입니다", 404);
}

module.exports = notFound;