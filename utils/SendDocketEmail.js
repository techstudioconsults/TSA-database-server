const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

// Load the email template
const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "../views/docRes.hbs"),
  "utf8"
);

// Compile the email template
const emailTemplate = handlebars.compile(emailTemplateSource);

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "brevo",
  host: "smtp-relay.brevo.com",
  port: 587,
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
const sendingDocketEmail = async ({
  email,
  name,
  studentId,
  phoneNumber,
  classType,
  courseCohort,
  pka,
  image,
  courseDuration,
}) => {
  try {
    // Compile the email template with provided data
    const emailHtml = emailTemplate({
      email,
      name,
      studentId,
      phoneNumber,
      classType,
      courseCohort,
      pka,
      image,
      courseDuration,
    });

    // Send the reminder email
    await transporter.sendMail({
      from: process.env.FROM,
      to: email,
      subject: "Student Enrollment Docket",
      html: emailHtml,
    });

    console.log("Docket email sent successfully");
  } catch (error) {
    console.error("Error sending Docket email:", error);
    throw new Error("Failed to send Docket email");
  }
};

module.exports = {
  sendingDocketEmail,
};
