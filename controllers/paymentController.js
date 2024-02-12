const Student = require("../models/students");

const getStudentPaymentRecord = async (req, res) => {
  res.send("get student payment record");
};

const addPaymentRecord = async (req, res) => {
  res.send("add new payment record");
};

const editPaymentRecord = async (req, res) => {
  res.send("edit a payment record");
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
