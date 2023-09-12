const { ERROR_CODE_FORBIDDEN } = require("../constantsStatusCodes");
const { FORBIDDEN } = require("../messages");

class ForbiddenError extends Error {
  constructor(message = FORBIDDEN) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = ERROR_CODE_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
