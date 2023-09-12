const { checkToken } = require("../utils/token");

const { UnauthorizedError } = require("../utils/errors");

const auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer jwt.token.fdfkweofwjenfjqfwqf"

    const payload = checkToken(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    req.user = payload;

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = auth;
