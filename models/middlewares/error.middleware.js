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
if (err.name === 'validationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.status = 400;
}
    } catch (error) {
        next(error);
    }
};
