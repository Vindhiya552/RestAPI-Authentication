const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(403).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ success: false, message: "Invalid or expired token" });

    req.user = decoded; // add decoded user info to req
    next();
  });
};
module.exports = verifyToken;