const errorHandler = (err, req, res, next) => {

  //if mongoose Error, res.statusCODE DNE, therefore defaults to 200, so if 200, make it 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // console.log("status code and err.message: ", statusCode + "  " + message);
  res.status(statusCode);

  res.json({ message: message, stack: err.stack });

 
};

module.exports = {
  errorHandler,
};
