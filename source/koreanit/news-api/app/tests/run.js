const newsCtl = require("../controllers/news.controller");

// Express 없이 컨트롤러 직접 실행
newsCtl.newsListController({}, { json: console.log }).catch(console.error);