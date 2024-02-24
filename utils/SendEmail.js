const { createTransport } = require("nodemailer");

const sendEmail = ({ to, message }) => {
  const transporter = createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 2525,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.FROM,
      pass: process.env.KEY,
    },
  });
  const mailOptions = {
    from: process.env.FROM, // sender address
    to: to, // email of the reciever
    subject: "Tech Studio Payment Reminder", // Subject line
    html: message, // html body that contains
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
};

module.exports = sendEmail;
