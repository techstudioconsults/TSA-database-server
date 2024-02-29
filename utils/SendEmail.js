const { createTransport } = require("nodemailer");

const sendEmail = ({ to, message, subject }) => {
  const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
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
    subject: subject, // Subject line
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
