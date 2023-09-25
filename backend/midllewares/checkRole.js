const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

//Возвращает мидлвэр, если role, передаваемая в аргументе совпала с ролью авторизованного по токену юзером, или "отказано в доступе"
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const { user } = req;

      if (user.role !== role) {
        return next(new ForbiddenError());
      }

      return next();
    } catch (e) {
      return next(new UnauthorizedError());
    }
  };
};

module.exports = checkRole;
