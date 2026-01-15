// 서버에서는 이 값이 여러 요청에 의해 동시에 변경될 수 있다
let a = 10;

function test() {
  let b = 20;
  console.log(a);
  console.log(b);
}

test();
console.log(a);
// console.log(b); // 오류