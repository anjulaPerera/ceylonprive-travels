// These mirror your Prisma models — the shape of data
// returned from your backend API.

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER";
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  mediaType: "IMAGE" | "VIDEO";
  category?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  title?: string;
  body: string;
  tourDate?: string;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface ReviewToken {
  id: string;
  token: string;
  customerName?: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
  review?: Review;
}

export interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  tripType?: string;
  groupSize?: number;
  preferredDate?: string;
  duration?: number;
  budget?: string;
  interests: string[];
  message?: string;
  status: "PENDING" | "VIEWED" | "REPLIED" | "CLOSED";
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  travelTime?: string;
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  duration: number;
  highlights: string[];
  days: ItineraryDay[];
  bestTimeToVisit: string;
}
