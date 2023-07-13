const express = require("express");
const router = express.Router();
const { authentication } = require("../Utils/Functions");
router.get("/", async (req, res) => {
  try {
    //Authenticating User
    const auth = await authentication();
    if (auth) {
      //If auth is not null
      //Initialize gmail instance
      const gmail = google.gmail({ version: "v1", auth });
    }
  } catch (err) {
    console.log(err);
  }

  res.send({ msg: "Welcome to world !" });
});

module.exports = router;
