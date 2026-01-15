new Promise(function (resolve, reject) {
  setTimeout(function () {
    reject("작업 완료");
  }, 1000);
}).then(function (result) {
  console.log(result);
}).catch(function (error) {
  console.log("에러 발생", error);
});