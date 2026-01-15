const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const { fetchRssToJson } = require("./rss");
const sources = {
  kr_it: "https://news.google.com/rss/search?q=IT&hl=ko&gl=KR&ceid=KR:ko",
};

const DATA_PATH = path.join(__dirname, "..", "data", "news.json");
const TMP_PATH = path.join(__dirname, "..", "data", "news.json.tmp");

const INTERVAL_MS = 3 * 60 * 1000;
//const INTERVAL_MS = 1000;

async function refreshOnce() {
  const sourceKey = "kr_it";
  const rssUrl = sources["kr_it"];

  const data = await fetchRssToJson(rssUrl, sourceKey);

  // tmp에 먼저 쓰고 rename하는 방식은 원자적 교체(atomic replace)에 가까워서 좋은 패턴
  await fsp.writeFile(TMP_PATH, JSON.stringify(data, null, 2), "utf-8");
  await fsp.rename(TMP_PATH, DATA_PATH);

  console.log(`[worker] saved ${data.count} items`);
}

async function loop() {
  while (true) {
    try {
      await refreshOnce();
    } catch (err) {
      console.error("[worker] refresh failed:", err);
      // 실패해도 워커는 계속 돈다
    }

    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
}

loop();