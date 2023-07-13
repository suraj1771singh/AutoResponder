const express = require("express");
const app = express();
const PORT = 5000;
const route = require("./Routes/routes");

app.use("/", route);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("Server listening at PORT ", PORT);
});
