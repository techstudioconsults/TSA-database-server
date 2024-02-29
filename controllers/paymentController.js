const Student = require("../models/students");
const { checkInputs } = require("../utils/helpers");
const sendEmail = require("../utils/SendEmail");
const { sendingReminderEmail } = require("../utils/SendReminderEmail");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const readHtmlTemplate = (templatePath) => {
  const filePath = path.join(__dirname, "..", "public", templatePath);
  return fs.readFileSync(filePath, "utf-8");
};

const getStudentPaymentRecord = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById({ _id: studentId }).populate({
      path: "modifiedBy",
      select: "name",
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const payments = student.payments;
    const {
      balance,
      paymentStatus,
      modifiedBy,
      fullName,
      courseFee,
      courseCohort,
    } = student;
    const sortedPayments = payments.sort((a, b) => b.datePaid - a.datePaid);
    res.status(200).json({
      success: true,
      payments: sortedPayments,
      balance,
      paymentStatus,
      fullName,
      courseFee,
      courseCohort,
      modifiedBy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPaymentRecord = async (req, res) => {
  const { studentId } = req.params;
  const { adminId } = req.user;
  const { amount, datePaid, paymentType, comment } = req.body;
  const receipt = req.files.receipt.tempFilePath;

  try {
    const payload = checkInputs(amount, datePaid, paymentType);
    if (!payload) {
      return res.status(400).json({ error: "Incomplete Payload" });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    //upload reciept
    const receiptResult = await cloudinary.uploader.upload(receipt, {
      use_filename: true,
      folder: "tsaDatabaseReceipts",
    });
    fs.unlinkSync(req.files.receipt.tempFilePath);

    //create new payment data
    const newPayment = {
      amount,
      datePaid,
      receipt: receiptResult.secure_url,
      comment,
      paymentType,
      paymentVerification: "verified",
    };

    //add new payment
    student.payments.push(newPayment);
    student.modifiedBy = adminId;
    await student.save();

    //send payment tag to student with complete payment
    if (student.paymentStatus === "full") {
      // Read HTML email template for payment tags
      const htmlTemplate = readHtmlTemplate("index.html");

      // Replace placeholders in the template
      const formattedHtml = htmlTemplate
        .replace("{{name}}", student.fullName)
        .replace("{{StudentId}}", student.studentId)
        .replace("{{course Cohort}}", student.courseCohort);
      const { email } = student;
      console.log(email);
      sendEmail({
        to: email,
        message: formattedHtml,
        subject: "Tech Studio Payment Tag",
      });
    }

    res.status(200).json({
      success: true,
      message: "new payment added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editPaymentRecord = async (req, res) => {
  const { studentId, paymentId } = req.params;
  const { adminId } = req.user;
  const {
    amount,
    datePaid,
    paymentType,
    comment,
    paymentVerification,
    discount,
  } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    // Find the payment record within the student's payments array
    const paymentToEdit = student.payments.id(paymentId);
    if (!paymentToEdit) {
      return res.status(404).json({ error: "Payment record not found" });
    }
    //upload change receipt
    if (req.files?.receipt) {
      const receiptResult = await cloudinary.uploader.upload(
        req.files.receipt.tempFilePath,
        {
          use_filename: true,
          folder: "tsaDatabaseReceipts",
        }
      );
      fs.unlinkSync(req.files.receipt.tempFilePath);

      paymentToEdit.receipt = receiptResult.secure_url || paymentToEdit.receipt;
    }

    //update payment record
    paymentToEdit.amount = amount || paymentToEdit.amount;
    paymentToEdit.paymentVerification =
      paymentVerification || paymentToEdit.paymentVerification;
    paymentToEdit.comment = comment || paymentToEdit.comment;
    paymentToEdit.datePaid = datePaid || paymentToEdit.datePaid;
    paymentToEdit.paymentType = paymentType || paymentToEdit.paymentType;
    student.modifiedBy = adminId || student.modifiedBy;
    student.discount = discount || student.discount;

    // Save the updated student with the edited payment record
    const updatedStudent = await student.save();
    //send payment tag to student with complete payment
    if (updatedStudent.paymentStatus === "full") {
      // Read HTML email template for payment tags
      const htmlTemplate = readHtmlTemplate("index.html");

      // Replace placeholders in the template
      const formattedHtml = htmlTemplate
        .replace("{{name}}", updatedStudent.fullName)
        .replace("{{StudentId}}", updatedStudent.studentId)
        .replace("{{course Cohort}}", updatedStudent.courseCohort);
      const { email } = student;
      sendEmail({
        to: email,
        message: formattedHtml,
        subject: "Tech Studio Complete Payment Tag",
      });
    }
    res.status(200).json({
      success: true,
      message: "payment updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendReminder = async (req, res) => {
  const { studentId, comments } = req.body;
  const regex = { $regex: studentId, $options: "i" };

  try {
    // Retrieve student information based on student ID
    const student = await Student.findOne({ studentId: regex });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Extract student information
    const { fullName, email } = student;

    // Send reminder email
    await sendingReminderEmail({ email, name: fullName, comments });

    res
      .status(200)
      .json({ success: true, message: "Reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getStudentPaymentRecord,
  addPaymentRecord,
  editPaymentRecord,
  sendReminder,
};
