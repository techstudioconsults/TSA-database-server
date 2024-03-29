const router = require("express").Router();
const {
  handleAddStudent,
  getAllStudents,
  getAStudent,
  handleEditStudent,
  handleShareEmail,
  getStudentViaStudentId,
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
router.patch("/:studentId", handleEditStudent);
router.get("/email/:studentId", handleShareEmail);
router.post("/check", getStudentViaStudentId);

//payment routes
router
  .route("/:studentId/payment")
  .get(getStudentPaymentRecord)
  .post(auth, addPaymentRecord);
router.patch("/:studentId/payment/:paymentId", auth, editPaymentRecord);

router.post("/send", sendReminder);

module.exports = router;
