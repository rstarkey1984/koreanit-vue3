const jwt = require("jsonwebtoken");
const { fail } = require("../utils/response");

function authRequired(req, res, next) {
  const auth = req.headers.authorization;

  // Authorization: Bearer <token>
  if (!auth || !auth.startsWith("Bearer ")) {
    return fail(res, "인증 토큰이 필요합니다", 401);
  }

  const token = auth.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 컨트롤러에서 사용
    return next();
  } catch (err) {
    return fail(res, "토큰이 유효하지 않습니다", 401, err.message);
  }
}

module.exports = authRequired;