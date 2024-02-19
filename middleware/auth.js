const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid Authentication" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { adminId: payload.adminId, name: payload.name };
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "authentication failed" });
  }
};

module.exports = auth;
