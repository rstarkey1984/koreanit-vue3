const http = require("http");

// 환경 변수 PORT가 있으면 사용하고,
// 없으면 기본값 3000을 사용한다
// 서버 설정은 코드가 아니라 실행 환경에서 결정된다
const PORT = process.env.PORT || 3000;
/*
process - 현재 실행 중인 Node.js 프로그램(프로세스) 자체를 가리키는 객체
process.env - 그 프로세스에 실행 시점에 전달된 환경 변수들
*/

// 서버 생성
// 이 콜백 함수는 요청이 들어올 때마다 실행된다
const server = http.createServer(function (req, res) {
  // 요청 정보 확인
  console.log("요청 수신:", req.method, req.url);

  // 응답 헤더 설정
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

  // 응답 본문 전송
  res.end(`서버 응답 (PORT=${PORT})`);
});

// 서버 실행 시작
// 이 시점에 프로세스가 생성되고 포트를 점유한다
server.listen(PORT, function () {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});