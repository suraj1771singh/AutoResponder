const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { authentication, getUnreadEmails, createLabels } = require("../Utils/Functions");
router.get("/", async (req, res) => {
  try {
    //Authenticating User
    const auth = await authentication();
    if (auth) {
      //If auth is not null
      //Initialize gmail instance
      const gmail = google.gmail({ version: "v1", auth });

      //Array of unread messages
      const messages = await getUnreadEmails(gmail);

      //Create Label | Parameter : gmail instance, label name
      const labelId = await createLabels(gmail, "Autoresponder");
      console.log(labelId);
    }
  } catch (err) {
    console.log(err);
  }

  res.send({ msg: "Welcome to world !" });
});

module.exports = router;
