const { verifyToken: jwtVerifyToken } = require("../helper/jwt.helper");

const getTokenData = (req) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return jwtVerifyToken(auth.slice(7));
  }
  return false;
};

const verifyToken = (req, res, next) => {
  const tokenData = getTokenData(req);
  if (!tokenData) {
    return res.status(401).json({ success: false, message: "You are not authenticated!" });
  }
  req.user = tokenData;
  next();
};

const verifyAdmin = (req, res, next) => {
  const tokenData = getTokenData(req);
  if (!tokenData) {
    return res.status(401).json({ success: false, message: "You are not authenticated!" });
  }

  if (tokenData.role === 'admin' || tokenData.role_id === 1) {
    req.user = tokenData;
    return next();
  }

  return res.status(403).json({ success: false, message: "Admin access required" });
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
