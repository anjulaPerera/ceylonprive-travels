import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
// import { fileURLToPath } from "url";
import { fileURLToPath } from "node:url";


config();

import authRoutes from "./routes/auth.js";
import galleryRoutes from "./routes/gallery.js";
import reviewRoutes from "./routes/reviews.js";
import tokenRoutes from "./routes/tokens.js";
import contactRoutes from "./routes/contact.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

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

// Only start the server if this file is run directly,
// not when it's imported by tests (Jest imports the module directly)
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`🌴 CeylonPrivé API running on port ${PORT}`);
//     console.log(`📍 Environment: ${process.env.NODE_ENV}`);
//   });
// }

// 1. Safe check for CommonJS environments (Jest)
// const isMainCJS = typeof require !== 'undefined' && require.main === module;

// // 2. Safe check for Native ESM environments (tsx / node production)
// const isMainESM = typeof import.meta?.url !== 'undefined' && 
//                   process.argv[1] === fileURLToPath(import.meta.url);

// // 3. True if either environment executes this file directly
// if (isMainCJS || isMainESM) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }


// const isMainCJS = typeof require !== "undefined" && require.main === module;
// const isMainESM =
//   typeof import.meta?.url !== "undefined" &&
//   process.argv[1] === fileURLToPath(import.meta.url);

// if (isMainCJS || isMainESM) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

const isMainESM =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

  if (isMainESM) {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  }

export default app;
