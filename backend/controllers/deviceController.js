const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const { Device, DeviceInfo } = require("../models/models");
const { STATUS_CODE_OK } = require("../utils/constantsStatusCodes");
const {
  BadRequestError,
  InternalServerError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const image = req.files?.image || null;

      if (!name || !price || !brandId || !typeId || !image) {
        throw new BadRequestError();
      }

      let fileName = uuid.v4() + ".jpg";

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        image: fileName,
      }).catch((e) => {
        if (e.name === "SequelizeUniqueConstraintError") {
          throw new ConflictError();
        }

        throw new InternalServerError();
      });

      if (info) {
        info = JSON.parse(info);

        info.forEach((item) => {
          DeviceInfo.create({
            title: item.title,
            description: item.description,
            deviceId: device.id,
          }).catch((e) => {
            if (e.name === "SequelizeUniqueConstraintError") {
              throw new ConflictError();
            }

            throw new InternalServerError();
          });
        });
      }

      image.mv(path.resolve(__dirname, "..", "static", fileName));

      return res.status(STATUS_CODE_OK).json(device);
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req, res, next) {
    let devices;

    let { brandId, typeId, limit, page } = req.query;

    page = page || 1;
    limit = limit || 9;

    let offset = limit * --page;

    try {
      if (brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId, typeId },
          limit,
          offset,
        });
      }
      if (brandId && !typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId },
          limit,
          offset,
        });
      }
      if (!brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId },
          limit,
          offset,
        });
      }
      if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({ limit, offset });
      }

      return res.status(STATUS_CODE_OK).json(devices);
    } catch (e) {
      return next(new InternalServerError());
    }
  }

  async getOneByID(req, res, next) {
    const id = Number(req.params.id);

    if (!id) {
      return next(new BadRequestError());
    }

    try {
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: "info" }],
      });

      if (!device) {
        return next(new NotFoundError());
      }

      res.status(STATUS_CODE_OK).json(device);
    } catch (e) {
      return next(new InternalServerError());
    }
  }

  async deleteById(req, res, next) {
    const id = Number(req.params.id);

    if (!id) {
      return next(new BadRequestError());
    }

    try {
      const device = await Device.findOne({
        where: { id },
      });

      if (!device) {
        return next(new NotFoundError());
      }

      await Device.destroy({ where: { id } });

      fs.unlink(
        path.resolve(__dirname, "..", "static", device.image),
        (e) => {}
      ); // Удаляем изображение устройства из папки static

      return res.status(STATUS_CODE_OK).json(device);
    } catch (e) {
      return next(new InternalServerError());
    }
  }
}

module.exports = new DeviceController();
