const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { authentication, getUnreadEmails, createLabels, getEmailById, sendReply } = require("../Utils/Functions");

router.get("/", async (req, res) => {
  try {
    //Authenticating User
    const auth = await authentication();

    if (auth) {
      //If auth is not null
      //Initialize gmail instance
      const gmail = google.gmail({ version: "v1", auth });

      //Create Label | Parameter : gmail instance, label name
      const labelId = await createLabels(gmail, "Autoresponder");

      //Repeat The Process after Random Interval
      setInterval(async () => {
        //Array of unread messages
        const messages = await getUnreadEmails(gmail);

        messages?.forEach(async (email) => {
          const { id } = email;

          //Fetch Email data
          const emailData = await getEmailById(gmail, id);

          //Checking if email has been replied before or not
          const isReplied = emailData.payload.headers.some((header) => header.name === "In-Reply-To");

          if (isReplied == false) {
            //Template of reply message
            const reply = "Thank you for reaching out. I'm currently busy, but I'll get back to you via email soon.";

            //Send Reply
            sendReply(gmail, emailData, reply, labelId);
          }
        });
      }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
    }
  } catch (err) {
    console.log(err);
  }
  res.send({ msg: "Welcome to world !" });
});

module.exports = router;
