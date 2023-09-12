const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/token");

const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} = require("../utils/errors");
const { UNAUTHORIZED_LOGIN, CONFLICT_EMAIL } = require("../utils/messages");

const { User, Basket } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");

class UserController {
  async register(req, res, next) {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return next(new BadRequestError());
    }

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(new ConflictError(CONFLICT_EMAIL));
    }

    const hashPassword = await bcrypt.hash(password, 4);

    try {
      const newUser = await User.create({
        email,
        password: hashPassword,
        role,
      });
      const basket = await Basket.create({ userId: newUser.id });

      const token = generateToken({
        id: newUser.id,
        email,
        role: newUser.role,
      });

      return res.status(STATUS_CODE_OK).json({ token });
    } catch (e) {
      return next(new InternalServerError(e.message));
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError());
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return next(new UnauthorizedError(UNAUTHORIZED_LOGIN));
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return next(new UnauthorizedError(UNAUTHORIZED_LOGIN));
      }

      const token = generateToken({ id: user.id, email, role: user.role });

      return res.status(STATUS_CODE_OK).json({ token });
    } catch (e) {
      return next(new InternalServerError());
    }
  }
  async checkAuth(req, res, next) {
    const user = req.user;

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(STATUS_CODE_OK).json({ token });
  }
}

module.exports = new UserController();
