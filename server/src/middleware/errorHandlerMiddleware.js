const errorHandler = (err, req, res, next) => {
      let statusCode = res.statusCode ? res.statusCode : 500;
    
      let message = err.message;
    
      res.status(statusCode).json({ message: message, stack: err.stack });
    };
    
    module.exports = {
      errorHandler,
    };