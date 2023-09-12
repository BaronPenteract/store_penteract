const jwt = require("jsonwebtoken");

const SECRET_KEY =
  process.env.MODE === "production" ? process.env.SECRET_KEY : "secret_key";

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

// checkToken возвращает payload, если проверка успешна, или false
const checkToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return false;
  }
};

module.exports = { generateToken, checkToken };
