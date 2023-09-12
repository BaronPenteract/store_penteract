const { Brand } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");
const { InternalServerError, BadRequestError } = require("../utils/errors");

class BrandController {
  async create(req, res, next) {
    const { name } = req.body;

    if (!name) {
      return next(new BadRequestError());
    }

    try {
      const brand = await Brand.create({ name });

      return res.status(STATUS_CODE_OK).json(brand);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(new ConflictError());
      }

      return next(new InternalServerError());
    }
  }

  async getAll(req, res, next) {
    try {
      const brands = await Brand.findAll();

      return res.status(STATUS_CODE_OK).json(brands);
    } catch (e) {
      return next(new InternalServerError());
    }
  }
}

module.exports = new BrandController();
