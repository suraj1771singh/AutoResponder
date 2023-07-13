const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

//Setting credentials.json file Path
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

//Defining Scopes Asked During Granting Permission
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.labels", "https://mail.google.com/"];

//---- Authentication User and Acessing Rights
const authentication = async () => {
  try {
    const auth = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
    });
    return auth;
  } catch (err) {
    console.log("Error in Authenticating User ", err);
  }
};

//---- Return Label ID on Passing Label Name
const getUserLabelId = async (gmail, labelName) => {
  try {
    //API request
    const res = await gmail.users.labels.list({ userId: "me" });

    //Response List of Labels, Find Required Label by Checking With Label Name
    const label = res.data.labels.find((item) => item.name === labelName);

    return label?.id;
  } catch (err) {
    console.log("Error in fetching User Labels List ", err);
  }
};

//---- Return List of UnreadEmails
const getUnreadEmails = async (gmail) => {
  try {
    //API Request : Fetch List of Unread Emails
    const res = await gmail.users.messages.list({ userId: "me", labelIds: ["INBOX"], q: "is:unread" });

    //Return List of Messages , If Null Return Empty List
    return res.data.messages || [];
  } catch (err) {
    console.log("Error in fetching Unread Emails ", err);
  }
};

//---- Return Email MetaData By Passing Email ID
const getEmailById = async (gmail, emailId) => {
  try {
    //API Request : Fetch Email Meta Data
    const res = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
    });

    return res.data;
  } catch (err) {
    console.log("Error in fetching Email by ID ", err);
  }
};

//---- Create Labels and Return Label ID
const createLabels = async (gmail, label) => {
  try {
    //API Request : Create Label, Pass Label Name and Some Label Properties inside RequestBody
    const res = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: label,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    // Return Label ID
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
//---- Send Reply and Mark Email to Autoresponder Label
const sendReply = async (gmail, email, message, labelId) => {
  try {
    //Defining replyMsg object
    const replyMsg = {
      userId: "me",
      resource: {
        raw: Buffer.from(`To: ${email.payload.headers.find((header) => header.name === "From").value}\r\n` + `Subject: Re: ${email.payload.headers.find((header) => header.name === "Subject").value}\r\n` + `Content-Type: text/plain; charset="UTF-8"\r\n` + `Content-Transfer-Encoding: 7bit\r\n\r\n` + `${message}+\r\n`).toString("base64"),
      },
    };
    //Sending Reply
    await gmail.users.messages.send(replyMsg);

    // Add Label and Move it to Autoresponder Label
    await gmail.users.messages.modify({
      userId: "me",
      id: email.id,
      resource: {
        addLabelIds: [labelId],
        removeLabelIds: ["INBOX"],
      },
    });
  } catch (err) {
    console.log("Error in Sending Reply ", err);
  }
};

//Export Functions
module.exports = { authentication, getUnreadEmails, createLabels, sendReply, getEmailById };
