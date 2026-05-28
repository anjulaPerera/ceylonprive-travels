import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../db/client.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { AppError } from "../middleware/errorHandler.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Zod schema — defines what a valid login request looks like.
// .trim() removes whitespace. .email() validates format.
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// POST /api/auth/login
// Rate limited to 10 attempts per 15 min (authLimiter)
// Validated against loginSchema before handler runs
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      // IMPORTANT: We check password even if user doesn't exist,
      // then return the same error either way.
      // This prevents "user enumeration" — attackers can't tell
      // if an email exists by checking error messages.
      if (!user) {
        await bcrypt.compare(password, "$2b$12$placeholderHashToPreventTiming");
        throw new AppError("Invalid email or password", 401);
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);

      if (!passwordValid) {
        throw new AppError("Invalid email or password", 401);
      }

      // Create JWT with user info encoded inside
 const token = jwt.sign(
   { userId: user.id, email: user.email, role: user.role },
   process.env.JWT_SECRET as string,
   { expiresIn: "7d" },
 );

      // Send token and safe user data (never send passwordHash)
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/auth/me
// Returns the currently logged in user's data.
// Frontend calls this on page load to check if token is still valid.
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/auth/logout
// JWTs are stateless — there's no server-side session to destroy.
// Logout is handled on the frontend by deleting the token.
// This endpoint exists as a clean API contract and for future
// token blacklisting if needed.
router.post("/logout", authenticate, (_req: Request, res: Response): void => {
  res.json({ message: "Logged out successfully" });
});

export default router;
