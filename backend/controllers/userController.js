const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/token");

const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

const {
  UNAUTHORIZED_LOGIN,
  CONFLICT_EMAIL,
  BAD_REQUEST_ROLE,
  SUCCESS,
} = require("../utils/messages");

const { ROLES, USER } = require("../utils/constants");

const { User, Basket } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
      });

      return res.status(STATUS_CODE_OK).json(users);
    } catch (e) {
      return next(new InternalServerError(e.message));
    }
  }

  async register(req, res, next) {
    const { email, password, role = USER } = req.body;

    if (!email || !password) {
      return next(new BadRequestError());
    }

    if (role !== USER) {
      return next(new BadRequestError(BAD_REQUEST_ROLE));
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

  async create(req, res, next) {
    const { email, password, role = USER } = req.body;

    if (!email || !password) {
      return next(new BadRequestError());
    }

    if (!role && !ROLES.includes(role)) {
      return next(BadRequestError(BAD_REQUEST_ROLE));
    }

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(new ConflictError(CONFLICT_EMAIL));
    }

    const hashPassword = await bcrypt.hash(password, 4);

    try {
      const user = await User.create({
        email,
        password: hashPassword,
        role,
      });
      const basket = await Basket.create({ userId: newUser.id });

      return res.status(STATUS_CODE_OK).json({ user });
    } catch (e) {
      return next(new InternalServerError(e.message));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError());
    }

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return next(new NotFoundError());
      }

      const isBasketDeleted = await Basket.destroy({ where: { userId: id } });
      const isUserDeleted = await User.destroy({ where: { id } });

      if (!isUserDeleted || !isBasketDeleted) {
        return next(new InternalServerError(isBasketDeleted));
      }

      return res.status(STATUS_CODE_OK).json({ user });
    } catch (e) {
      return next(new InternalServerError(e.message));
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
