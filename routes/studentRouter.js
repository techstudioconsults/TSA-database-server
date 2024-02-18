const router = require("express").Router();
const {
  handleAddStudent,
  getAllStudents,
  getAStudent,
} = require("../controllers/studentController");

const {
  getStudentPaymentRecord,
  addPaymentRecord,
  editPaymentRecord,
  sendReminder,
} = require("../controllers/paymentController");

router.route("/").post(handleAddStudent).get(getAllStudents);
router.get("/:studentId", getAStudent);

//payment routes
router
  .route("/:studentId/payment")
  .get(getStudentPaymentRecord)
  .post(addPaymentRecord);
router.patch("/:studentId/payment/:paymentId", editPaymentRecord);

module.exports = router;
