import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { generateItinerary } from "../services/gemini.js";

const router = Router();

const itinerarySchema = z.object({
  days: z.number().int().min(1).max(21),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  groupSize: z.number().int().min(1).max(50).default(2),
  budget: z.enum(["budget", "mid-range", "luxury"]).default("mid-range"),
});

// POST /api/ai/itinerary
// Public — anyone on the landing page can use the AI planner.
// Rate limited to 20 requests per hour per IP (aiLimiter).
router.post(
  "/itinerary",
  aiLimiter,
  validate(itinerarySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { days, interests, groupSize, budget } = req.body;

      const itinerary = await generateItinerary(
        days,
        interests,
        groupSize,
        budget,
      );

      res.json({ itinerary });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
