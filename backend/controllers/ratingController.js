const { Device, Rating } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");
const { InternalServerError, BadRequestError } = require("../utils/errors");
const { SUCCESS } = require("../utils/messages");

class ratingController {
  async create(req, res, next) {
    try {
      const { id, rate } = req.params;
      const user = req.user;

      if ((!id, !rate)) {
        return next(new BadRequestError());
      }

      const device = await Device.findByPk(id);

      if (!device) {
        return next(new BadRequestError());
      }

      const ratingOfUser = await Rating.findOne({
        where: { userId: user.id, deviceId: device.id },
      });

      if (ratingOfUser) {
        await ratingOfUser.update({ rate });

        return res.status(STATUS_CODE_OK).json(ratingOfUser);
      }

      const rating = await Rating.create({
        userId: user.id,
        deviceId: device.id,
        rate,
      });

      return res.status(STATUS_CODE_OK).json(rating);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(new ConflictError());
      }

      return next(new InternalServerError());
    }
  }

  async getOneById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(new BadRequestError());
      }

      const device = await Device.findByPk(id);

      if (!device) {
        return next(new BadRequestError());
      }

      const votes = await Rating.count({ where: { deviceId: id } });

      const rating = { votes: 0, rates: 0, rating: 0, device };

      if (votes) {
        const rates = await Rating.sum("rate", { where: { deviceId: id } });

        return res
          .status(STATUS_CODE_OK)
          .json({ ...rating, votes, rates, rating: rates / votes });
      }

      return res.status(STATUS_CODE_OK).json(rating);
    } catch (e) {
      return next(new InternalServerError());
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id) {
        return next(new BadRequestError());
      }

      const device = await Device.findByPk(id);

      if (!device) {
        return next(new BadRequestError());
      }

      const ratingOfUser = await Rating.findOne({
        where: { userId: user.id, deviceId: device.id },
      });

      if (!ratingOfUser) {
        return next(new BadRequestError());
      }

      ratingOfUser.destroy();

      return res.status(STATUS_CODE_OK).json({ message: SUCCESS });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(new ConflictError());
      }

      return next(new InternalServerError());
    }
  }
}

module.exports = new ratingController();
