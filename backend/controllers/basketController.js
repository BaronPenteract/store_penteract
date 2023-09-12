const { Basket, Device, BasketDevice } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");
const { SUCCESS } = require("../utils/messages");
const {
  InternalServerError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} = require("../utils/errors");

class basketController {
  async add(req, res, next) {
    const { id } = req.body;
    const user = req.user;

    if (!id) {
      return next(new BadRequestError());
    }

    try {
      const device = await Device.findOne({ where: { id } });

      const basket = await Basket.findOne({ where: { userId: user.id } });

      if (!basket || !device) {
        return next(new NotFoundError());
      }

      const basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId: device.id,
      });

      return res.status(STATUS_CODE_OK).json({ id: basketDevice.id, device });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(new ConflictError());
      }

      return next(new InternalServerError());
    }
  }

  async getAll(req, res, next) {
    const user = req.user;

    try {
      const basket = await Basket.findOne({ where: { userId: user.id } });

      if (!basket) {
        return next(new NotFoundError());
      }

      const basketDevices = await BasketDevice.findAll({
        where: { basketId: basket.id },
        attributes: ["id"],
        include: [{ model: Device }],
      });

      return res.status(STATUS_CODE_OK).json(basketDevices);
    } catch (e) {
      return next(new InternalServerError());
    }
  }

  async remove(req, res, next) {
    const id = Number(req.params.id);
    const user = req.user;

    if (!id) {
      return next(new BadRequestError());
    }

    try {
      const basket = await Basket.findOne({ where: { userId: user.id } });

      const basketDevice = await BasketDevice.findOne({ where: { id } });

      // Проверка на принадлежность записи в таблице BasketDevice авторизованному пользователю
      if (basket.id === basketDevice.basketId) {
        await BasketDevice.destroy({
          where: { id },
        });
      } else {
        return next(new ForbiddenError());
      }

      return res.status(STATUS_CODE_OK).json({ message: SUCCESS });
    } catch (e) {
      return next(new InternalServerError());
    }
  }
}

module.exports = new basketController();
