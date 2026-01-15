function work() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve("run 작업 완료");
    }, 1000);
  });
}


async function run() {
  console.log("run 작업시작");
  const result = await work();
  console.log(result);
}

let r = run();
console.log(r);
console.log("작업 시작");
setTimeout(function () {
      console.log(r);
    }, 2000);
