let work = function(callback){
  
  callback();
  
  console.log("작업 중...");
  
  // (function () {
  //   console.log("작업 완료 후 실행");
  // })();
}

let func = function () {
  console.log("작업 완료 후 실행");
}

work(func);