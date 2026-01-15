class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Esto nos dice que es un error previsto por nosotros

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;