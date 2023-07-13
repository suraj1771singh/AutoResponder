const express = require("express");
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to openinAPP");
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("Server listening at PORT ", PORT);
});
