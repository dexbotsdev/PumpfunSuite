const { ObjectId } = require("mongoose").Types;
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { GeneralError } = require("./errors");
const { searchOne } = require("../core/repository");

const handleError = async (err, req, res, next) => {
  if (res?.headersSent) {
    return next(err);
  }

  let code = 500;
  if (err instanceof GeneralError) {
    code = err.getCode();
  }

  const correlationId = req?.headers["x-correlation-id"];
  req.log.error(err, { correlationId });
  return (
    res &&
    res.status(code).send({
      correlationId,
      message: err.message,
      status: "error",
      error: { ...err },
    })
  );
};

const handleRequest = async (req, res, next) => {
  let correlationId = req.headers["x-correlation-id"];
  if (!correlationId) {
    correlationId = uuidv4();
    req.headers["x-correlation-id"] = correlationId;
  }

  res.set("x-correlation-id", correlationId);
  req.log = req.log.child({ correlationId });
  req.log.info(`new request: ${req.method} ${req.url}`);
  return next();
};

const handleValidation = (validate) => (req, res, next) => {
  const result = validate(req.body, req.user);
  const isValid = result.error == null;
  if (isValid) {
    req.body = result.value;
    return next();
  }

  const { details } = result.error;
  const messages = details.map((e) => e.message);
  const msg = messages.join(",");
  // throw new BadRequest(msg);
  return res.status(400).send({ status: "error", message: msg });
};

const authenticateRequest = async (req, res, next) => {
  let auth = req.headers.authorization;
  return next();
};

// authorize request
const authorizeRequest = async (req, res, next) => {
  const { user } = req;
  return next();
};

module.exports = {
  handleError,
  handleRequest,
  handleValidation,
  authenticateRequest,
  authorizeRequest,
};
