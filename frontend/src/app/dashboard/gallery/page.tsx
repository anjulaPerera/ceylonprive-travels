"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ImageIcon,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { GalleryItem } from "@/types/models";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  "beaches",
  "temples",
  "wildlife",
  "highlands",
  "culture",
  "cuisine",
  "adventure",
  "heritage",
  "people",
  "nature",
];

export default function GalleryDashboardPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    try {
      const response = await api.get("/api/gallery/all");
      setItems(response.data.items);
    } catch {
      toast.error("Failed to load gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP images and MP4 videos are allowed");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be smaller than 10MB");
      return;
    }

    setUploadFile(file);

    // Create preview for images
    if (file.type !== "video/mp4") {
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file first");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please add a title");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle.trim());
      if (uploadDescription) formData.append("description", uploadDescription);
      if (uploadCategory) formData.append("category", uploadCategory);

      await api.post("/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Photo uploaded successfully!");
      setShowUploadForm(false);
      resetUploadForm();
      fetchItems();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      await api.patch(`/api/gallery/${item.id}/publish`, {
        isPublished: !item.isPublished,
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isPublished: !i.isPublished } : i,
        ),
      );
      toast.success(
        item.isPublished ? "Hidden from homepage" : "Published to homepage",
      );
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/api/gallery/${item.id}`);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadTitle("");
    setUploadDescription("");
    setUploadCategory("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const publishedCount = items.filter((i) => i.isPublished).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-gold mb-2">
            <ImageIcon size={16} />
            <span className="text-xs tracking-widest uppercase font-sans font-light">
              Gallery Management
            </span>
          </div>
          <h1 className="font-serif text-4xl text-cream font-light">
            Photo Gallery
          </h1>
          <p className="text-cream-dark font-sans font-light text-sm mt-1">
            {items.length} items total · {publishedCount} published on homepage
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-navy text-sm tracking-widest uppercase font-sans hover:bg-gold-light transition-all duration-300"
        >
          <Plus size={16} />
          Upload Photo
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div
          className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (!isUploading) setShowUploadForm(false);
          }}
        >
          <div
            className="w-full max-w-xl bg-navy-light border border-gold/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gold/10">
              <p className="font-serif text-xl text-cream font-light">
                Upload New Photo
              </p>
              {!isUploading && (
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="text-cream-dark hover:text-gold transition-colors"
                  aria-label="Close upload modal"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="p-8 space-y-5">
              {/* File Drop Zone */}
              <div
                className={cn(
                  "border-2 border-dashed transition-colors duration-300 cursor-pointer",
                  uploadFile
                    ? "border-gold/50 bg-gold/5"
                    : "border-gold/20 hover:border-gold/40",
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <label
                  htmlFor="file-drop"
                  className="block text-xs tracking-widest uppercase text-gold font-sans mb-2"
                >
                  Title *
                </label>
                <input
                  id="file-drop"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {uploadPreview ? (
                  <div className="relative aspect-video">
                    <Image
                      src={uploadPreview}
                      alt="Upload preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : uploadFile ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <ImageIcon size={32} className="text-gold" />
                    <p className="text-cream font-sans text-sm">
                      {uploadFile.name}
                    </p>
                    <p className="text-cream-dark/60 font-sans text-xs">
                      Video file selected
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Upload size={28} className="text-gold/60" />
                    <div className="text-center">
                      <p className="text-cream font-sans text-sm mb-1">
                        Click to select a file
                      </p>
                      <p className="text-cream-dark/60 font-sans text-xs">
                        JPEG, PNG, WebP up to 10MB · MP4 video
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                  Title *
                </label>
                <input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
                  placeholder="e.g. Sigiriya at Golden Hour"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors resize-none"
                  placeholder="Brief caption for this image..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                  Category (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setUploadCategory(uploadCategory === cat ? "" : cat)
                      }
                      className={cn(
                        "px-3 py-1.5 text-xs tracking-wide font-sans border transition-all duration-200",
                        uploadCategory === cat
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/20 text-cream-dark hover:border-gold/50",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadFile || !uploadTitle.trim()}
                className={cn(
                  "w-full py-4 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 mt-2",
                  isUploading || !uploadFile || !uploadTitle.trim()
                    ? "bg-gold/30 text-gold/50 cursor-not-allowed"
                    : "bg-gold text-navy hover:bg-gold-light",
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-navy-mid animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border border-gold/10 p-20 text-center">
          <ImageIcon size={40} className="text-gold/30 mx-auto mb-4" />
          <p className="font-serif text-2xl text-cream-dark font-light mb-2">
            No photos yet
          </p>
          <p className="text-cream-dark/60 font-sans text-sm mb-6">
            Upload your first photo to get started
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-8 py-3 bg-gold text-navy text-sm tracking-widest uppercase font-sans hover:bg-gold-light transition-all duration-300"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square bg-navy-mid overflow-hidden border border-gold/10"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                {/* Top — title and category */}
                <div>
                  <p className="font-serif text-cream text-sm font-light leading-tight">
                    {item.title}
                  </p>
                  {item.category && (
                    <span className="text-xs text-gold/80 font-sans tracking-wider mt-1 block">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Bottom — action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={
                      item.isPublished
                        ? "Hide from homepage"
                        : "Publish to homepage"
                    }
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-sans tracking-wide border transition-all duration-200",
                      item.isPublished
                        ? "border-gold/50 text-gold bg-gold/10"
                        : "border-cream/30 text-cream-dark hover:border-gold/50",
                    )}
                  >
                    {item.isPublished ? (
                      <>
                        <Eye size={12} />
                        Live
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        Hidden
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    title="Delete permanently"
                    className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Published badge */}
              {item.isPublished && (
                <div className="absolute top-2 right-2 bg-gold text-navy text-[10px] font-sans font-medium px-2 py-0.5 tracking-wider">
                  LIVE
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
