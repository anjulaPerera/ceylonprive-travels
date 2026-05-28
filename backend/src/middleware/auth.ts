import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db/client.js";

// The shape of data we encode inside the JWT
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract token from Authorization header.
    // Header format: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify the token signature and expiry.
    // If the token was tampered with or expired, this throws.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Fetch the user from DB to confirm they still exist
    // and haven't been deleted since the token was issued.
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: "User no longer exists" });
      return;
    }

    // Attach user to the request object.
    // Now every downstream route handler can access req.user
    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws JsonWebTokenError for invalid tokens
    // and TokenExpiredError for expired ones.
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired, please login again" });
      return;
    }
    next(error);
  }
};
