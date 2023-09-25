const express = require("express");
const app = express();
var nodemailer = require("nodemailer");

const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${base}/dashboard.html`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "himanshu02092002@gmail.com",
    pass: "manofheart",
  },
});
