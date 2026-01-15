const fs = require("fs").promises;
const path = require("path");
const { ok } = require("../utils/response");

const DATA_PATH = path.join(__dirname, "..", "..", "data", "news.json");

async function newsListController(req, res, next) {

  try {
    
    res.set("Cache-Control", "public, max-age=60");

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return ok(res, data, "뉴스 목록", 200);
  } catch (err) {
    return next(err);
  }
}

function newsPostController(req, res) {
  return ok(res, {"message":"NEWS POST"});
}

function newsPutController(req, res) {
  return ok(res, {"message":"NEWS PUT"});
}

function newsDeleteController(req, res) {
  return ok(res, {"message":"NEWS DELETE"});
}

module.exports = {
  newsListController,
  newsPostController,
  newsPutController,
  newsDeleteController,
};