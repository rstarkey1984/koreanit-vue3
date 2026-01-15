const express = require("express");
const router = express.Router();

const authCtl = require("../controllers/auth.controller");
const authRequired = require("../middlewares/authRequired");

router.post("/login", authCtl.loginController);
router.get("/me", authRequired, authCtl.meController);

module.exports = router;