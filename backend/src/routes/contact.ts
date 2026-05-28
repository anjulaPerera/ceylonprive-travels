import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../db/client.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  tripType: z.string().trim().optional(),
  groupSize: z.number().int().min(1).optional(),
  preferredDate: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  budget: z.string().optional(),
  interests: z.array(z.string()).optional().default([]),
  aiGeneratedPlan: z.record(z.string(), z.unknown()).optional(),
  message: z.string().trim().optional(),
});

// POST /api/contact
// Public — anyone can submit the contact form.
// Rate limited to prevent spam.
router.post(
  "/",
  generalLimiter,
  validate(contactSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          ...req.body,
          preferredDate: req.body.preferredDate
            ? new Date(req.body.preferredDate)
            : null,
        },
      });

      res.status(201).json({
        message: "Thank you! We will be in touch within 24 hours.",
        id: submission.id,
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/contact
// Protected — guide views all contact submissions in the dashboard.
router.get(
  "/",
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ submissions });
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /api/contact/:id/status
// Protected — guide updates the status of a submission.
router.patch(
  "/:id/status",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const submission = await prisma.contactSubmission.update({
        where: { id: String(req.params.id) },
        data: { status: req.body.status },
      });
      res.json({ submission });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
