import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";

config();

import authRoutes from "./routes/auth";
import galleryRoutes from "./routes/gallery";
import reviewRoutes from "./routes/reviews";
import tokenRoutes from "./routes/tokens";
import contactRoutes from "./routes/contact";
import aiRoutes from "./routes/ai";
import { errorHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security middleware ───────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── General rate limiting on all API routes ───────────────────
app.use("/api", generalLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ceylonprive-api",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler — MUST be last ──────────────────────
// Express identifies this as an error handler because it has 4 parameters
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌴 CeylonPrivé API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
