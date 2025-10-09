const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const secret = process.env.JWT_SECRET || "development-secret-change-me";
    const decoded = jwt.verify(token.split(" ")[1], secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = verifyToken;
