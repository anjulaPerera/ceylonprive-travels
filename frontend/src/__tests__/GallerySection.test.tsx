import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import GallerySection from "@/components/landing/GallerySection";
import api from "@/lib/api";

// Mock the API module
jest.mock("@/lib/api");
const mockApi = api as jest.Mocked<typeof api>;

// Mock IntersectionObserver — not available in jsdom
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

const mockGalleryItems = [
  {
    id: "1",
    title: "Sigiriya Rock",
    url: "https://res.cloudinary.com/test/sigiriya.jpg",
    mediaType: "IMAGE" as const,
    isPublished: true,
    sortOrder: 0,
    createdAt: "2025-01-01T00:00:00.000Z",
    category: "landmarks",
  },
  {
    id: "2",
    title: "Galle Fort",
    url: "https://res.cloudinary.com/test/galle.jpg",
    mediaType: "IMAGE" as const,
    isPublished: true,
    sortOrder: 1,
    createdAt: "2025-01-02T00:00:00.000Z",
    category: "heritage",
  },
];

describe("GallerySection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton initially", () => {
    // Mock API that never resolves (stays loading)
    mockApi.get = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const { container } = render(<GallerySection />);
    // Skeleton has animate-pulse class
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders gallery items after successful fetch", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: mockGalleryItems },
    }) as jest.Mock;

    render(<GallerySection />);

    await waitFor(() => {
      expect(screen.getByAltText("Sigiriya Rock")).toBeInTheDocument();
      expect(screen.getByAltText("Galle Fort")).toBeInTheDocument();
    });
  });

  it("shows empty state when no gallery items", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: [] },
    }) as jest.Mock;

    render(<GallerySection />);

    await waitFor(() => {
      expect(screen.getByText("Gallery coming soon")).toBeInTheDocument();
    });
  });

  it("shows section header", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: [] },
    }) as jest.Mock;

    render(<GallerySection />);

    expect(screen.getByText("Visual Journey")).toBeInTheDocument();
    expect(screen.getByText("Ceylon Through My Lens")).toBeInTheDocument();
  });

  it("opens lightbox when gallery item is clicked", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: mockGalleryItems },
    }) as jest.Mock;

    render(<GallerySection />);

    await waitFor(() => {
      expect(screen.getByAltText("Sigiriya Rock")).toBeInTheDocument();
    });

    // Click on the gallery item container
    const galleryImage = screen.getByAltText("Sigiriya Rock");
    const itemContainer = galleryImage.closest('[class*="cursor-pointer"]');
    if (itemContainer) fireEvent.click(itemContainer);

    // Lightbox should appear with larger image
    await waitFor(() => {
      const images = screen.getAllByAltText("Sigiriya Rock");
      expect(images.length).toBeGreaterThan(1); // one in grid, one in lightbox
    });
  });

  it("closes lightbox on Escape key", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: mockGalleryItems },
    }) as jest.Mock;

    render(<GallerySection />);

    await waitFor(() => {
      expect(screen.getByAltText("Sigiriya Rock")).toBeInTheDocument();
    });

    // Open lightbox
    const galleryImage = screen.getByAltText("Sigiriya Rock");
    const itemContainer = galleryImage.closest('[class*="cursor-pointer"]');
    if (itemContainer) fireEvent.click(itemContainer);

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      const images = screen.getAllByAltText("Sigiriya Rock");
      expect(images.length).toBe(1); // back to just grid image
    });
  });

  it("handles API error gracefully — shows empty state", async () => {
    mockApi.get = jest
      .fn()
      .mockRejectedValue(new Error("Network error")) as jest.Mock;

    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<GallerySection />);

    await waitFor(() => {
      expect(screen.getByText("Gallery coming soon")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("displays category label on gallery items", async () => {
    mockApi.get = jest.fn().mockResolvedValue({
      data: { items: mockGalleryItems },
    }) as jest.Mock;

    render(<GallerySection />);
    // await waitFor(() => {
    //   expect(screen.getByText("Visual Journey")).toBeInTheDocument();
    // });

    await waitFor(() => {
      expect(screen.getByAltText("Sigiriya Rock")).toBeInTheDocument();
    });

    // Categories are shown in hover overlay — they exist in DOM
    expect(screen.getByText("landmarks")).toBeInTheDocument();
  });
});
