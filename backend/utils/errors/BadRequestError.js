const { ERROR_CODE_BAD_REQUEST } = require("../constantsStatusCodes");
const { BAD_REQUEST } = require("../messages");

class BadRequestError extends Error {
  constructor(message = BAD_REQUEST) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = ERROR_CODE_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
