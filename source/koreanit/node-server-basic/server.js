const http = require("http");

console.log("PID:", process.pid);

const PORT = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
  console.log("요청 수신:", req.method, req.url);

  //console.log("HEADERS:", req.headers);

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("홈");
  }

  if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ message: "API 응답" }));
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, function () {
  console.log("서버 실행: http://localhost:" + PORT);
});