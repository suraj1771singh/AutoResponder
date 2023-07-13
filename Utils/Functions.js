const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.labels", "https://mail.google.com/"];

const authentication = async () => {
  try {
    const auth = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
    });
    return auth;
  } catch (err) {
    console.log(err);
  }
};

const getUserLabelId = async (gmail, labelName) => {
  try {
    const res = await gmail.users.labels.list({ userId: "me" });
    const label = res.data.labels.find((item) => item.name === labelName);
    return label?.id;
  } catch (err) {
    console.log("Error in fetching User Labels List ", err);
  }
};

const getUnreadEmails = async (gmail) => {
  try {
    const res = await gmail.users.messages.list({ userId: "me", labelIds: ["INBOX"], q: "is:unread" });
    return res.data.messages || [];
  } catch (err) {
    console.log("Error in fetching Unread Emails ", err);
  }
};

const createLabels = async (gmail, label) => {
  try {
    const res = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: label,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    const id = res.data.id;
    return id;
  } catch (err) {
    if (err.code === 409) {
      //This means Label already exist
      //Fetch label id from its name
      const id = await getUserLabelId(gmail, label);
      return id;
    }
    console.log("Error in creating Labels ", err);
  }
};
module.exports = { authentication, getUnreadEmails, createLabels };
