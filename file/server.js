// server.js
const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "data", "news.json");

/* =========================
 * 1) 기본 미들웨어
 * ========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청/응답 로그 미들웨어
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[LOG] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

/* =========================
 * 2) 응답 통일
 * ========================= */
function ok(res, data = null, message = "OK", status = 200) {
  return res.status(status).json({
    success: true,
    code: status,
    message,
    data,
  });
}

function fail(res, message = "Error", status = 500, error = null) {
  return res.status(status).json({
    success: false,
    code: status,
    message,
    error,
  });
}

/* =========================
 * 3) async 에러 전달
 * ========================= */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* =========================
 * 4) 컨트롤러
 * ========================= */
async function healthController(req, res) {
  return ok(res, { service: "news-api" }, "API 서버 실행 중");
}

async function newsListController(req, res) {
  const limit = req.query.limit;
  const keyword = req.query.keyword;

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  return ok(res, { meta: { limit, keyword }, items: data }, "뉴스 목록");
}

async function devEchoController(req, res) {
  return ok(res, makeRequestInfo(req), "요청 정보");
}

function makeRequestInfo(req) {
  return {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  };
}

/* =========================
 * 5) Router 구성
 * ========================= */
app.get("/", asyncHandler(healthController));

const newsRouter = express.Router();
newsRouter.get("/", asyncHandler(newsListController));
app.use("/api/news", newsRouter);

const devRouter = express.Router();
devRouter
  .route("/:path")
  .get(asyncHandler(devEchoController))
  .post(asyncHandler(devEchoController))
  .put(asyncHandler(devEchoController))
  .delete(asyncHandler(devEchoController));
app.use("/api/dev", devRouter);

/* =========================
 * 6) 404 처리
 * ========================= */
app.use((req, res) => {
  return fail(res, "Not Found", 404);
});

/* =========================
 * 7) 전역 에러 핸들러
 * ========================= */
app.use((err, req, res, next) => {
  console.error("[ERR]", err);

  if (err && err.code === "ENOENT") {
    return fail(res, "데이터 파일이 없습니다.", 404, err.message);
  }

  if (err instanceof SyntaxError) {
    return fail(res, "파싱 오류", 400, err.message);
  }

  return fail(res, "서버 오류", 500, err.message);
});

app.listen(PORT, () => {
  console.log(`API 서버 실행: http://localhost:${PORT}`);
});
