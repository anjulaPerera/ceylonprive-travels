import { Request, Response, NextFunction } from "express";

// Custom error class so we can attach HTTP status codes to errors.
// Instead of throwing new Error("Not found"), we throw
// new AppError("Not found", 404) and the status code travels with it.
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks it as a known, expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

// The global error handler — registered LAST in index.ts
// Express knows this is an error handler because it has 4 parameters.
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default to 500 if no status code is attached
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  // In development, send the full stack trace so you can debug.
  // In production, never expose stack traces — security risk.
  const response: Record<string, unknown> = {
    error: message,
    status: statusCode,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
