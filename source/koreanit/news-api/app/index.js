const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API 서버 실행: http://localhost:${PORT}`);
});