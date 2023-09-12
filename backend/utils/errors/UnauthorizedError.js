const { ERROR_CODE_UNAUTHORIZED } = require("../constantsStatusCodes");
const { UNAUTHORIZED } = require("../messages");

class UnauthorizedError extends Error {
  constructor(message = UNAUTHORIZED) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = ERROR_CODE_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
