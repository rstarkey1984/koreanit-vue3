const express = require("express");
const app = express();

const newsRouter = require("./routes/news.router");
const requestLogger = require("./middlewares/requestLogger");
const authRouter = require("./routes/auth.router");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const helmet = require("helmet");
const timeout = require("./middlewares/timeout");
const rateLimit = require("express-rate-limit");
const { fail } = require("./utils/response");

app.set("trust proxy", 1); // 요청 앞단에 프록시가 1개 있다고 가정하고, 그 프록시가 붙인 IP 관련 헤더를 신뢰하겠다

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // 1분에 최대 5번 요청 허용
  handler: (req, res) => {
    return fail(res, "요청이 너무 많습니다", 429);
  }
});

app.use("/api", apiLimiter);

// /api 전체 요청에 5초 제한
app.use("/api", timeout(5000));

if (process.env.NODE_ENV === "development") {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false
    })
  );
} else {
  app.use(helmet());
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("API 서버 실행 중");
});

app.use("/api/news", newsRouter);

app.use("/api/auth", authRouter);

app
  .route("/api/dev/:path")
  .get((req, res) => res.json(makeRequestInfo(req)))
  .post((req, res) => res.json(makeRequestInfo(req)))
  .put((req, res) => res.json(makeRequestInfo(req)))
  .delete((req, res) => res.json(makeRequestInfo(req)));

function makeRequestInfo(req) {
  return {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  };
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;