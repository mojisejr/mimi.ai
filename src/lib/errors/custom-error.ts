export class CustomError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, data?: any) {
    super(message, "VALIDATION_ERROR", 400, data);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "Forbidden") {
    super(message, "AUTHORIZATION_ERROR", 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Not Found") {
    super(message, "NOT_FOUND_ERROR", 404);
  }
}

export class APIError extends CustomError {
  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message, "API_ERROR", statusCode, data);
  }
}

export class NetworkError extends CustomError {
  constructor(message: string = "Network Error") {
    super(message, "NETWORK_ERROR", 0);
  }
}
