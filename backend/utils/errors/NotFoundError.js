const { ERROR_CODE_NOT_FOUND } = require("../constantsStatusCodes");
const { NOT_FOUND } = require("../messages");

class NotFoundError extends Error {
  constructor(message = NOT_FOUND) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
}

module.exports = NotFoundError;
