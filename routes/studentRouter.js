const router = require("express").Router();
const {
  handleAddStudent,
  getAllStudents,
  getAStudent,
} = require("../controllers/studentController");

router.post("/", handleAddStudent);

module.exports = router;
