function ok(res, data = null, message = "OK", code = 200) {
  return res.status(code).json({
    success: true,
    code,
    message,
    data,
  });
}

function fail(res, message = "FAIL", code = 500, error = null) {
  return res.status(code).json({
    success: false,
    code,
    message,
    error,
  });
}

module.exports = { ok, fail };