const Admin = require("../models/admin");
const { checkInputs } = require("../utils/helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//handleAdminRegister
const handleAdminRegister = async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    const payload = checkInputs(name, password, email);
    if (!payload) {
      return res.status(400).json({ error: "Incomplete Payload" });
    }

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ error: "Admin account already exist" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      password: hashedPassword,
      email,
      role,
    });
    res.status(201).json({
      success: true,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//handleAdminLogin
const handleAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const payload = checkInputs(password, email);
    if (!payload) {
      return res
        .status(400)
        .json({ error: "Please Provide Email and Password" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin account not found" });
    }
    const isCorrect = await bcrypt.compare(password, admin.password);
    if (!isCorrect) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    // generate token
    const token = jwt.sign(
      { adminId: admin._id, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleAdminLogin, handleAdminRegister };
