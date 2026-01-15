const fs = require("fs/promises");

fs.readFile("data.txt", "utf-8")
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log("파일 읽기 실패");
  });