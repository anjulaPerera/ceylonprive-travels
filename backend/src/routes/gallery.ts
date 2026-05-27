import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { z } from "zod";
import prisma from "../db/client";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinary";

const router = Router();

// Multer with memory storage — file goes into req.file.buffer
// 10MB limit — enough for high-quality photos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP images and MP4 videos are allowed"));
    }
  },
});

const galleryItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
});

// GET /api/gallery
// Public endpoint — returns all PUBLISHED gallery items for the homepage.
// No auth required — the homepage needs to show these to visitors.
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        thumbnailUrl: true,
        mediaType: true,
        category: true,
        sortOrder: true,
      },
    });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

// GET /api/gallery/all
// Protected — returns ALL gallery items including unpublished ones.
// Used by the dashboard to show the guide everything they've uploaded.
router.get(
  "/all",
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.galleryItem.findMany({
        orderBy: { sortOrder: "asc" },
      });
      res.json({ items });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/gallery
// Protected — upload a new media file.
// Uses multer to parse the file, then uploads to Cloudinary.
router.post(
  "/",
  authenticate,
  upload.single("file"), // "file" must match the form field name
  validate(galleryItemSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded", 400);
      }

      const { title, description, category } = req.body;
      const isVideo = req.file.mimetype === "video/mp4";

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "ceylonprive/gallery",
        isVideo ? "video" : "image",
      );

      // Save reference to database
      const galleryItem = await prisma.galleryItem.create({
        data: {
          userId: req.user!.id,
          title,
          description,
          category,
          cloudinaryId: uploadResult.public_id,
          url: uploadResult.secure_url,
          thumbnailUrl: uploadResult.thumbnail_url,
          mediaType: isVideo ? "VIDEO" : "IMAGE",
        },
      });

      res.status(201).json({ item: galleryItem });
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /api/gallery/:id/publish
// Protected — toggle publish status of a gallery item.
router.patch(
  "/:id/publish",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const item = await prisma.galleryItem.update({
        where: { id: String(id) },
        data: { isPublished },
      });

      res.json({ item });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/gallery/:id
// Protected — deletes from both Cloudinary AND the database.
// Order matters: delete from Cloudinary first. If that fails,
// we don't delete the DB record — data stays consistent.
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const item = await prisma.galleryItem.findUnique({
        where: { id: String(id) },
      });
      if (!item) throw new AppError("Gallery item not found", 404);

      // Delete from Cloudinary first
      await deleteFromCloudinary(
        item.cloudinaryId,
        item.mediaType === "VIDEO" ? "video" : "image",
      );

      // Then delete from database
      await prisma.galleryItem.delete({ where: { id: String(id) } });

      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
