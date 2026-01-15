const fs = require("fs").promises;
const path = require("path");
const DATA_PATH = path.join(__dirname, "data", "news.json");

const raw = await fs.readFile(DATA_PATH, "utf-8");
const data = JSON.parse(raw);
console.log(data);