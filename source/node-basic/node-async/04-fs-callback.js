const fs = require("fs");

fs.readFile("data.txt", "utf-8", function (err, data) {
  if (err) {
    console.log("파일 읽기 실패");
    return;
  }

  console.log(data);
});