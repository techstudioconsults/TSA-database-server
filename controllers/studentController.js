const Student = require("../models/students");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { checkInputs } = require("../utils/helpers");
const {
  getCourseFee,
  getCourseTypeAbbreviation,
  getCourseCode,
} = require("../utils/studentHelper");

const generateStudentId = async (classType, courseCohort) => {
  const date = new Date();
  const year = (date.getFullYear() % 100).toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const courseCode = getCourseCode(courseCohort);
  const courseTypeAbbreviation = getCourseTypeAbbreviation(classType);

  const studentId = `${year}${month}${courseCode}${(
    (await Student.countDocuments({ classType, courseCohort })) + 1
  )
    .toString()
    .padStart(2, "0")}${courseTypeAbbreviation}`;
  return studentId;
};

// add student
const handleAddStudent = async (req, res) => {
  const {
    fullName,
    pka,
    email,
    phoneNumber,
    whatsappNumber,
    courseCohort,
    classType,
    emergencyContactName,
    emergencyContactLocation,
    emergencyContactNumber,
    amount,
  } = req.body;
  // console.log(req.body);

  const payload = checkInputs(
    fullName,
    pka,
    email,
    phoneNumber,
    whatsappNumber,
    courseCohort,
    classType,
    emergencyContactName,
    emergencyContactLocation,
    emergencyContactNumber,
    amount
  );

  const receipt = req.files.receipt.tempFilePath;
  const image = req.files.image.tempFilePath;

  try {
    if (!payload) {
      console.log(payload);
      return res.status(400).json({ message: "Incomplete Payload" });
    }
    // upload image
    const imageResult = await cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: "tsaDatabaseImages",
    });
    fs.unlinkSync(req.files.image.tempFilePath);

    //upload receipt
    const receiptResult = await cloudinary.uploader.upload(receipt, {
      use_filename: true,
      folder: "tsaDatabaseReceipts",
    });
    fs.unlinkSync(req.files.receipt.tempFilePath);

    //set up payment
    const payments = { amount, receipt: receiptResult.secure_url };

    //studentId
    const studentId = await generateStudentId(classType, courseCohort);
    // get course fee
    const courseFee = getCourseFee(classType, courseCohort);

    //add to db
    const newStudent = new Student({
      fullName,
      pka,
      email,
      phoneNumber,
      whatsappNumber,
      courseCohort,
      classType,
      emergencyContactName,
      emergencyContactLocation,
      emergencyContactNumber,
      payments,
      studentId,
      courseFee,
      image: imageResult.secure_url,
    });

    const student = await newStudent.save();

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllStudents = async (req, res) => {
  //add query search by name, studentId, courseCohort
  try {
    const students = await Student.find().sort("-createdAt");
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById({ _id: studentId });
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleAddStudent, getAllStudents, getAStudent };
