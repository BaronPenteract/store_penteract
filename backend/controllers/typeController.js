const { Type } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");
const {
  InternalServerError,
  BadRequestError,
  ConflictError,
} = require("../utils/errors");

class TypeController {
  async create(req, res, next) {
    const { name } = req.body;

    if (!name) {
      return next(new BadRequestError());
    }

    try {
      const type = await Type.create({ name });

      return res.status(STATUS_CODE_OK).json(type);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(new ConflictError());
      }

      return next(new InternalServerError());
    }
  }

  async getAll(req, res, next) {
    try {
      const types = await Type.findAll();

      return res.status(STATUS_CODE_OK).json(types);
    } catch (e) {
      return next(new InternalServerError());
    }
  }
}

module.exports = new TypeController();
