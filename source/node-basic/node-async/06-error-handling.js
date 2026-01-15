const fs = require("fs/promises");

async function read() {
  try {
    const data = await fs.readFile("not-exist.txt", "utf-8");
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

read();