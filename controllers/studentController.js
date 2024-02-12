const Student = require("../models/students");

function getCourseTypeAbbreviation(courseType) {
  switch (courseType) {
    case "weekend":
      return "WE";
    case "weekday":
      return "WD";
    case "online":
      return "ON";
    default:
      return "";
  }
}
function getCourseCode(course) {
  if (course.toLowerCase().includes("full")) {
    return "01";
  } else if (course.toLowerCase().includes("front")) {
    return "02";
  } else if (
    course.toLowerCase().includes("product") ||
    course.toLowerCase().includes("ui")
  ) {
    return "03";
  } else if (course.toLowerCase().includes("data")) {
    return "04";
  } else if (course.toLowerCase().includes("cyber")) {
    return "05";
  }
}

const genereateStudentId = async (course, courseType) => {
  const date = new Date();
  const year = (date.getFullYear() % 100).toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const courseCode = getCourseCode(course);
  const courseTypeAbbreviation = getCourseTypeAbbreviation(courseType);

  const studentId = `${year}${month}${courseCode}${(
    (await Student.countDocuments({ course, courseType })) + 1
  )
    .toString()
    .padStart(2, "0")}${courseTypeAbbreviation}`;
  return studentId;
};

// add student
const handleAddStudent = async (req, res) => {
  const course = "cybersecurity 2024";
  const courseType = "online";

  const studentId = await genereateStudentId(course, courseType);
  res.send("Add student " + studentId);
};

const getAllStudents = async (req, res) => {
  res.send("get all students");
};
const getAStudent = async (req, res) => {
  res.send("get a student");
};

module.exports = { handleAddStudent, getAllStudents, getAStudent };
