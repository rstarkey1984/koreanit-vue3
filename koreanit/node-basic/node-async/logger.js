function info(msg) {
  console.log("[INFO]", msg, "test","test");
}

function error(msg) {
  console.log("[ERROR]", msg);
}

module.exports = {
  info,
  error,
};