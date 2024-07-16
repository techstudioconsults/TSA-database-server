const Student = require("../models/students");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { checkInputs } = require("../utils/helpers");
const {
  getCourseFee,
  getCourseTypeAbbreviation,
  getCourseCode,
  createCourseDuration,
} = require("../utils/studentHelper");
const { sendingDocketEmail } = require("../utils/SendDocketEmail");

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
    referralStudentId,
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
  const existingStudent = await Student.findOne({
    fullName,
    courseCohort,
  });

  if (existingStudent) {
    return res
      .status(400)
      .json({ error: "You have already registered for this course" });
  }

  const courseDuration = createCourseDuration(courseCohort);

  const receipt = req.files.receipt.tempFilePath;
  const image = req.files.image.tempFilePath;

  try {
    if (!payload) {
      console.log(payload);
      return res.status(400).json({ error: "Incomplete Payload" });
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

    // find and store referralStudentName
    let referralStudentName = "";
    if (referralStudentId) {
      const regex = { $regex: referralStudentId, $options: "i" };
      const referral = await Student.findOne({ studentId: regex });
      if (referral) {
        referralStudentName = referral.fullName;
      }
    }

    //add to db
    const newStudent = new Student({
      fullName,
      pka,
      email,
      phoneNumber,
      whatsappNumber,
      courseCohort,
      classType,
      courseDuration,
      emergencyContactName,
      emergencyContactLocation,
      emergencyContactNumber,
      payments,
      studentId,
      courseFee,
      image: imageResult.secure_url,
      referralStudentId,
      referralStudentName,
    });

    const student = await newStudent.save();

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllStudents = async (req, res) => {
  const { searchTerm } = req.query;
  const queryObject = {};
  // search by studentId, name, courseCohort, pka
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  if (searchTerm) {
    const regex = { $regex: searchTerm, $options: "i" };
    queryObject.$or = [
      { studentId: regex },
      { fullName: regex },
      { courseCohort: regex },
      { pka: regex },
    ];
  }

  try {
    const students = await Student.find(queryObject)
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);
    const allStudents = await Student.find().sort("-createdAt");
    // Calculate totalAmountPaid and totalBalance
    const totalAmountPaid = allStudents.reduce(
      (sum, student) =>
        sum +
        student.payments.reduce(
          (paymentSum, payment) => paymentSum + payment.amount,
          0
        ),
      0
    );

    const totalBalance = allStudents.reduce(
      (sum, student) => sum + student.balance,
      0
    );

    const studentsWithTotalAmountPaid = await Promise.all(
      students.map(async (student) => {
        const totalAmountPaid = student.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        return {
          ...student._doc,
          totalAmountPaid,
        };
      })
    );
    res.status(200).json({
      success: true,
      numOfStudents: allStudents.length,
      revenue: totalAmountPaid,
      balance: totalBalance,
      students: studentsWithTotalAmountPaid,
      currentPage: page,
      totalPages: Math.ceil(students.length / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById({ _id: studentId });
    // Calculate the total amount paid
    // const totalAmountPaid = student.payments.reduce(
    //   (sum, payment) => sum + payment.amount,
    //   0
    // );
    if (!student) {
      return res.status(404).json({ error: "Student Not Found" });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleEditStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById({ _id: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student Not Found" });
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: studentId },
      req.body,
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Student info updated correctly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleShareEmail = async (req, res) => {
  const { traineeId } = req.params;
  try {
    const student = await Student.findById({ _id: traineeId });
    if (!student) {
      return res.status(404).json({ error: "Student Not Found" });
    }

    const {
      email,
      fullName,
      studentId,
      phoneNumber,
      classType,
      courseCohort,
      pka,
      image,
      courseDuration,
    } = student;

    await sendingDocketEmail({
      email,
      name: fullName,
      studentId,
      phoneNumber,
      classType,
      courseCohort,
      pka,
      image,
      courseDuration,
    });

    res
      .status(200)
      .json({ success: true, message: "Reminder email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get studentby their id

const getStudentViaStudentId = async (req, res) => {
  const { studentId } = req.body;
  try {
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete Payload" });
    }
    const regex = { $regex: studentId, $options: "i" };
    const student = await Student.findOne({ studentId: regex }).select(
      "image fullname pka courseCohort studentId email phoneNumber whatsappNumber"
    );

    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleAddStudent,
  getAllStudents,
  getAStudent,
  handleEditStudent,
  handleShareEmail,
  getStudentViaStudentId,
};
