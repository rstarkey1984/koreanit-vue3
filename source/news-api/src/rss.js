const { parseStringPromise } = require("xml2js");
const crypto = require("crypto");

function makeId(link) {
  return crypto.createHash("sha1").update(link).digest("hex");
}

async function fetchRssToJson(rssUrl, sourceKey) {
  const response = await fetch(rssUrl);
  if (!response.ok) {
    throw new Error(`RSS 요청 실패: ${response.status}`);
  }

  const xml = await response.text();
  const parsed = await parseStringPromise(xml);

  const channel = parsed.rss.channel[0];
  const items = channel.item || [];

  const normalized = items.map((it) => {
    const title = it.title?.[0] || "";
    const link = it.link?.[0] || "";
    const publishedAt = it.pubDate?.[0] || "";
    const publisher = it.source?.[0]?._ || "";

    return {
      id: makeId(link || title),
      title,
      link,
      publisher,
      publishedAt,
    };
  });

  return {
    source: sourceKey,
    updatedAt: new Date().toISOString(),
    count: normalized.length,
    items: normalized,
  };
}

module.exports = { fetchRssToJson };