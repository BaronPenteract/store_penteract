const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).send({ message: err.message });
};

module.exports = errorHandler;
