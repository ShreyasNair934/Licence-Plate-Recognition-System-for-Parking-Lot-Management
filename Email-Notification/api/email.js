const nodemailer = require("nodemailer");

// Create a function to send emails
function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Chotugummybear@gmail.com",
      pass: "ymlp aztd obcy nult",
    },
  });

  const mailOptions = {
    from: "Chotugummybear@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Export the sendEmail function
module.exports = sendEmail;
