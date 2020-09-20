const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header(process.env.TOKEN_HEADER);
  if (!token) {
    return res.status(401).json({ errors: { message: "Unauthorized" } });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("ERROR", error.message);
    return res.status(500).json({ message: error.message, error });
  }
};
