const { fail } = require("../utils/response");

function timeout(ms = 5000) {
  return (req, res, next) => {
    res.setTimeout(ms, () => {
      // 이미 응답이 나간 경우 중복 응답 방지
      if (res.headersSent) return;

      return fail(res, "요청 처리 시간 초과", 504);
    });

    next();
  };
}

module.exports = timeout;