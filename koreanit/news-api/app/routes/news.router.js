const express = require("express");
const router = express.Router();

const newsCtl = require("../controllers/news.controller");

// /api/news
router
  .route("/")
  .get(newsCtl.newsListController)
  .post(newsCtl.newsPostController)
  .put(newsCtl.newsPutController)
  .delete(newsCtl.newsDeleteController);

module.exports = router;