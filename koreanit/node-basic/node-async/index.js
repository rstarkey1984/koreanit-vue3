const addtest = require("./math");
const logger = require("./logger");

console.log(addtest(3, 5));
logger.info("서버 시작");
logger.error("에러 발생");