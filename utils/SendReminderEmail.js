const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

// Load the email template
const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "../views/emailRes.hbs"),
  "utf8"
);

// Compile the email template
const emailTemplate = handlebars.compile(emailTemplateSource);

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "brevo",
  host: "smtp-relay.sendinblue.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.FROM,
    pass: process.env.KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send a reminder email
const sendingReminderEmail = async ({ email, studentId, name, comments }) => {
  try {
    // Compile the email template with provided data
    const emailHtml = emailTemplate({ name, studentId, comments });

    // Send the reminder email
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Payment Reminder",
      html: emailHtml,
    });

    console.log("Reminder email sent successfully");
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw new Error("Failed to send reminder email");
  }
};

module.exports = {
  sendingReminderEmail,
};
