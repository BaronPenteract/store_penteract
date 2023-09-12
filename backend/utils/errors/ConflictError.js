const { ERROR_CODE_CONFLICT } = require("../constantsStatusCodes");
const { CONFLICT } = require("../messages");

class ConflictError extends Error {
  constructor(message = CONFLICT) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = ERROR_CODE_CONFLICT;
  }
}

module.exports = ConflictError;
