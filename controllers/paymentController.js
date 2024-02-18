const Student = require("../models/students");
const { checkInputs } = require("../utils/helpers");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getStudentPaymentRecord = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById({ _id: studentId });
    const payments = student.payments;
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPaymentRecord = async (req, res) => {
  const { studentId } = req.params;
  const { amount, datePaid, paymentType, comment } = req.body;
  const receipt = req.files.receipt.tempFilePath;

  try {
    const payload = checkInputs(amount, datePaid, paymentType);
    if (!payload) {
      return res.status(400).json({ message: "Incomplete Payload" });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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
    };

    //add new payment
    student.payments.push(newPayment);
    await student.save();

    res.status(200).json({ success: true, payment: student.payments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editPaymentRecord = async (req, res) => {
  const { studentId, paymentId } = req.params;
  const { amount, datePaid, paymentType, comment, paymentVerification } =
    req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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

    // Save the updated student with the edited payment record
    const updatedStudent = await student.save();
    res.status(200).json({
      success: true,
      payment: updatedStudent.payments,
      balance: updatedStudent.balance,
      paymentStatus: updatedStudent.paymentStatus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendReminder = async (req, res) => {
  res.send("send Reminder");
};
module.exports = {
  getStudentPaymentRecord,
  addPaymentRecord,
  editPaymentRecord,
  sendReminder,
};
