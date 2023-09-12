const { ERROR_CODE_INTERNAL_SERVER } = require("../constantsStatusCodes");
const { INTERNAL_SERVER } = require("../messages");

class InternalServerError extends Error {
  constructor(message = INTERNAL_SERVER) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = ERROR_CODE_INTERNAL_SERVER;
  }
}

module.exports = InternalServerError;
