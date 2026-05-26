import rateLimit from "express-rate-limit";

// General API limiter — applied to all routes.
// 100 requests per 15 minutes per IP.
// Most legitimate users will never hit this.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Sends RateLimit headers in the response
  legacyHeaders: false, // Disables the old X-RateLimit headers
});

// Strict limiter for the login endpoint.
// Only 10 attempts per 15 minutes per IP.
// Prevents brute force password attacks.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many login attempts, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI limiter — protects your free Gemini quota.
// Only 20 AI requests per hour per IP.
// A real user planning a trip won't need more than this.
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    error: "AI request limit reached. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
