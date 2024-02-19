const router = require("express").Router();
const {
  handleAdminLogin,
  handleAdminRegister,
} = require("../controllers/adminController");

router.post("/login", handleAdminLogin);
router.post("/register", handleAdminRegister);

module.exports = router;
