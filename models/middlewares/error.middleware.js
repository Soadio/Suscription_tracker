const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err};
    error.message = err.message;
console.log(error);

// Mongoose bad objectId
if (err.name === 'CastError') {
    const message = 'resource not found';
    error = Error(message);
    error.status = 404;
    return res.status(404).send({ message: error.message });
}

// Mongoose duplicate key
if (err.code === '11000') {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
    }
    
 // Mongoose validation error
     if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
         error = new Error(message.join('. '));
         error.statusCode = 400;
        }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    })
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;