const jwt = require("jsonwebtoken");
const { ok, fail } = require("../utils/response");
const { AUTH_USER } = require("../config/auth");

function loginController(req, res) {
  const { id, password } = req.body;

  // 입력값 검증(최소)
  if (!id || !password) {
    return fail(res, "id/password가 필요합니다", 400);
  }

  // 하드코딩 계정 확인
  if (id !== AUTH_USER.id || password !== AUTH_USER.password) {
    return fail(res, "아이디 또는 비밀번호가 올바르지 않습니다", 401);
  }

  const payload = {
    id: AUTH_USER.id,
    name: AUTH_USER.name
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h"
  });

  // 토큰 응답은 캐시 금지 권장
  res.set("Cache-Control", "no-store");

  return ok(res, { token }, "로그인 성공", 200);
}

function meController(req, res) {
  // auth 미들웨어가 req.user를 세팅해준다는 가정
  return ok(res, { user: req.user }, "내 정보", 200);
}

module.exports = { loginController, meController };