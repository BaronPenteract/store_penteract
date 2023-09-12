const { checkToken } = require("../utils/token");

const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

//Возвращает мидлвэр, если role, передаваемая в аргументе совпала с ролью авторизованного по токену юзером, или "отказано в доступе"
const checkRole = (role) => {
  console.log(role);
  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1]; // "Bearer jwt.token.fdfkweofwjenfjqfwqf"

      const payload = checkToken(token);

      if (!payload) {
        throw new UnauthorizedError();
      }

      if (payload.role !== role) {
        return next(new ForbiddenError());
      }

      req.user = payload;

      return next();
    } catch (e) {
      return next(new UnauthorizedError());
    }
  };
};

module.exports = checkRole;
