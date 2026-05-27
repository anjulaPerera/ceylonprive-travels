import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../db/client";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { verifyReviewToken } from "../services/token";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const submitReviewSchema = z.object({
  token: z.string().min(1, "Token is required"),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().optional(),
  body: z.string().trim().min(20, "Review must be at least 20 characters"),
  tourDate: z.string().optional(),
});

// GET /api/reviews
// Public — returns approved and published reviews for the homepage.
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true, isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        rating: true,
        title: true,
        body: true,
        tourDate: true,
        createdAt: true,
      },
    });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/all
// Protected — guide sees all reviews including pending approval.
router.get(
  "/all",
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: { reviewToken: { select: { customerName: true } } },
      });
      res.json({ reviews });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/reviews
// Public — customer submits a review using a valid token.
// The token is consumed (marked usedAt) after successful submission.
router.post(
  "/",
  validate(submitReviewSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        token,
        customerName,
        customerEmail,
        rating,
        title,
        body,
        tourDate,
      } = req.body;

      // Verify token is valid
      const verification = await verifyReviewToken(token);
      if (!verification.valid) {
        throw new AppError(verification.reason as string, 400);
      }

      const reviewToken = verification.reviewToken!;

      // Create the review and mark the token as used in one transaction.
      // A transaction means both operations succeed or both fail together.
      // We never want a review without its token being consumed, or vice versa.
      const [review] = await prisma.$transaction([
        prisma.review.create({
          data: {
            reviewTokenId: reviewToken.id,
            customerName,
            customerEmail: customerEmail || null,
            rating,
            title,
            body,
            tourDate: tourDate ? new Date(tourDate) : null,
          },
        }),
        prisma.reviewToken.update({
          where: { id: reviewToken.id },
          data: { usedAt: new Date() },
        }),
      ]);

      res.status(201).json({
        message: "Thank you for your review!",
        review: { id: review.id, customerName: review.customerName },
      });
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /api/reviews/:id/approve
// Protected — guide approves a review to make it visible.
router.patch(
  "/:id/approve",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { isApproved, isPublished } = req.body;

      const review = await prisma.review.update({
        where: { id: String(req.params.id) },
        data: { isApproved, isPublished },
      });

      res.json({ review });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
