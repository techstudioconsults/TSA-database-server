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
const auth = require("../middleware/auth");

router.route("/").post(handleAddStudent).get(getAllStudents);
router.get("/:studentId", getAStudent);

//payment routes
router
  .route("/:studentId/payment")
  .get(getStudentPaymentRecord)
  .post(auth, addPaymentRecord);
router.patch("/:studentId/payment/:paymentId", auth, editPaymentRecord);

router.post("/:studentId/send", sendReminder);

module.exports = router;
