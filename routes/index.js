const express = require("express");
const router = express.Router();

router.use("/signup", require("./signup"));
router.use("/login", require("./login"));
router.use("/posts", require("./post"));
router.use("/comments", require("./comment"));

module.exports = router