const router = require("express").Router();
const {
  handleAdminLogin,
  handleAdminRegister,
  getUserDetails,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/login", handleAdminLogin);
router.post("/register", handleAdminRegister);
router.get("/user", auth, getUserDetails);

module.exports = router;
