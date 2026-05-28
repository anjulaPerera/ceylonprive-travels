import type {
  User,
  GalleryItem,
  Review,
  ReviewToken,
  ContactSubmission,
  GeneratedItinerary,
} from "@/types/models";

// These tests confirm the TypeScript interfaces are correctly shaped.
// They will fail at COMPILE TIME if the types are wrong — that's the point.

describe("Type shapes — compile-time validation", () => {
  it("User type has required fields", () => {
    const user: User = {
      id: "uuid-123",
      email: "test@example.com",
      name: "Test User",
      role: "ADMIN",
    };
    expect(user.id).toBe("uuid-123");
    expect(user.role).toBe("ADMIN");
  });

  it("GalleryItem type has required fields with correct types", () => {
    const item: GalleryItem = {
      id: "uuid-456",
      title: "Sigiriya Sunrise",
      url: "https://res.cloudinary.com/test/image.jpg",
      mediaType: "IMAGE",
      isPublished: true,
      sortOrder: 0,
      createdAt: "2025-01-01T00:00:00.000Z",
    };
    expect(item.mediaType).toBe("IMAGE");
    expect(item.isPublished).toBe(true);
  });

  it("GalleryItem supports optional fields", () => {
    const item: GalleryItem = {
      id: "uuid-789",
      title: "Beach",
      url: "https://res.cloudinary.com/test/beach.jpg",
      mediaType: "VIDEO",
      isPublished: false,
      sortOrder: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      description: "A beautiful beach",
      thumbnailUrl: "https://res.cloudinary.com/test/thumb.jpg",
      category: "beaches",
    };
    expect(item.description).toBe("A beautiful beach");
    expect(item.category).toBe("beaches");
  });

  it("Review type has required fields", () => {
    const review: Review = {
      id: "review-123",
      customerName: "James Anderson",
      rating: 5,
      body: "Incredible experience",
      isApproved: true,
      isPublished: true,
      createdAt: "2025-01-01T00:00:00.000Z",
    };
    expect(review.rating).toBe(5);
    expect(review.isApproved).toBe(true);
  });

  it("ContactSubmission status values are correct enum", () => {
    const statuses: ContactSubmission["status"][] = [
      "PENDING",
      "VIEWED",
      "REPLIED",
      "CLOSED",
    ];
    expect(statuses).toHaveLength(4);
    expect(statuses[0]).toBe("PENDING");
  });

  it("GeneratedItinerary has days array", () => {
    const itinerary: GeneratedItinerary = {
      title: "Ceylon Discovery",
      summary: "7 days of wonder",
      duration: 7,
      highlights: ["Sigiriya", "Galle", "Kandy"],
      days: [
        {
          day: 1,
          title: "Arrival in Colombo",
          location: "Colombo",
          description: "Arrive and explore the city",
          activities: ["City tour", "Galle Face Green"],
          accommodation: "Colombo boutique hotel",
          meals: ["Breakfast at hotel", "Lunch at local restaurant", "Dinner"],
        },
      ],
      bestTimeToVisit: "December to March",
    };
    expect(itinerary.days).toHaveLength(1);
    expect(itinerary.highlights).toContain("Sigiriya");
  });

  it("ReviewToken usedAt is optional", () => {
    const unusedToken: ReviewToken = {
      id: "token-123",
      token: "abc123def456",
      expiresAt: "2025-12-31T00:00:00.000Z",
      createdAt: "2025-01-01T00:00:00.000Z",
    };
    expect(unusedToken.usedAt).toBeUndefined();

    const usedToken: ReviewToken = {
      ...unusedToken,
      usedAt: "2025-06-01T00:00:00.000Z",
    };
    expect(usedToken.usedAt).toBeTruthy();
  });
});
