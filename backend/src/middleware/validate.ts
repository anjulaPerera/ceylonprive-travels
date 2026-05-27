import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// A middleware factory — takes a Zod schema, returns Express middleware.
// Usage in routes: router.post('/login', validate(loginSchema), loginHandler)
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // schema.parse() throws a ZodError if validation fails.
      // It also TRANSFORMS the data — e.g. trims whitespace,
      // converts types — and replaces req.body with the cleaned version.
      req.body = schema.parse(req.body);
      next(); // Validation passed — move to the route handler
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod's error array into readable messages.
        // e.g. ["email: Invalid email", "password: Too short"]
        const messages = error.issues.map(
          (e) => `${e.path.join(".")}: ${e.message}`,
        );
        res.status(400).json({
          error: "Validation failed",
          details: messages,
        });
        return;
      }
      next(error); // Unknown error — pass to global error handler
    }
  };
};
