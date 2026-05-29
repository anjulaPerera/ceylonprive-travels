import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { generateItinerary } from "../services/gemini.js";
import { sendItineraryEmail } from "../services/email.js";

const router = Router();

const itinerarySchema = z.object({
  days: z.number().int().min(1).max(21),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  groupSize: z.number().int().min(1).max(50).default(2),
  budget: z.enum(["budget", "mid-range", "luxury"]).default("mid-range"),
  // Optional — if provided, email the itinerary to the customer
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
});

// POST /api/ai/itinerary
// Public — anyone on the landing page can use the AI planner, and receive the email
// Rate limited to 20 requests per hour per IP (aiLimiter).
router.post(
  "/itinerary",
  aiLimiter,
  validate(itinerarySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        days,
        interests,
        groupSize,
        budget,
        customerEmail,
        customerName,
      } = req.body;

      const itinerary = await generateItinerary(
        days,
        interests,
        groupSize,
        budget,
      );

      // Send email to customer if they provided their address
      if (customerEmail) {
        try {
          await sendItineraryEmail(
            customerEmail,
            customerName ?? "Valued Guest",
            itinerary,
          );
        } catch (emailError) {
          // Don't fail the whole request if email fails
          console.error("Failed to send itinerary email:", emailError);
        }
      }

      res.json({
        itinerary,
        emailSent: !!customerEmail,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
