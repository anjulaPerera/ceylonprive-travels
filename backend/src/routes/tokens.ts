import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../db/client";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { generateReviewToken, verifyReviewToken } from "../services/token";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const generateTokenSchema = z.object({
  customerName: z.string().trim().optional(),
  expiryDays: z.number().min(1).max(30).default(7),
});

// POST /api/tokens/generate
// Protected — guide generates a review link for a specific customer.
router.post(
  "/generate",
  authenticate,
  validate(generateTokenSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customerName, expiryDays } = req.body;

      const { token, expiresAt } = await generateReviewToken(
        req.user!.id,
        customerName,
        expiryDays,
      );

      // Build the full review URL the guide will send to the customer
      const reviewUrl = `${process.env.FRONTEND_URL}/review/${token}`;

      res.status(201).json({
        token,
        reviewUrl,
        expiresAt,
        customerName,
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/tokens
// Protected — list all tokens the guide has generated.
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await prisma.reviewToken.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        include: { review: true },
      });
      res.json({ tokens });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/tokens/verify/:token
// Public — called by the frontend when a customer visits /review/[token]
// to check if the token is valid before showing the review form.
router.get(
  "/verify/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await verifyReviewToken(req.params.token);

      if (!result.valid) {
        res.status(400).json({ valid: false, reason: result.reason });
        return;
      }

      res.json({
        valid: true,
        customerName: result.reviewToken?.customerName,
        expiresAt: result.reviewToken?.expiresAt,
      });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/tokens/:id
// Protected — guide can revoke an unused token.
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = await prisma.reviewToken.findUnique({
        where: { id: req.params.id },
      });

      if (!token) throw new AppError("Token not found", 404);
      if (token.usedAt) throw new AppError("Cannot delete a used token", 400);

      await prisma.reviewToken.delete({ where: { id: req.params.id } });
      res.json({ message: "Token revoked successfully" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
