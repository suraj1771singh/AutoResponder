const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ msg: "Welcome to world !" });
});

module.exports = router;
