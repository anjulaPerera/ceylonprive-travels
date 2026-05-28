import { cn, formatDate, truncate, formatRating } from "@/lib/utils";

describe("cn() — class name merger", () => {
  it("combines class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes — truthy", () => {
    expect(cn("base", true && "active")).toBe("base active");
  });

  it("handles conditional classes — falsy", () => {
    expect(cn("base", false && "active")).toBe("base");
  });

  it("resolves Tailwind conflicts — last one wins", () => {
    // tailwind-merge resolves bg-red vs bg-blue
    const result = cn("bg-red-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});

describe("formatDate()", () => {
  it("formats a Date object to readable string", () => {
    const date = new Date("2025-01-15T00:00:00.000Z");
    const result = formatDate(date);
    // The exact format depends on locale but should contain year and month
    expect(result).toContain("2025");
    expect(result).toContain("January");
  });

  it("formats a date string to readable string", () => {
    const result = formatDate("2025-06-20");
    expect(result).toContain("2025");
    expect(result).toContain("June");
  });

  it("handles ISO timestamp strings", () => {
    const result = formatDate("2025-12-01T10:30:00.000Z");
    expect(result).toContain("2025");
  });
});

describe("truncate()", () => {
  it("returns the string unchanged if shorter than maxLength", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("returns the string unchanged if exactly maxLength", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("truncates and appends ellipsis if longer than maxLength", () => {
    const result = truncate("Hello World", 5);
    expect(result).toContain("…");
    expect(result.length).toBeLessThanOrEqual(6); // 5 chars + ellipsis
  });

  it("trims whitespace before appending ellipsis", () => {
    const result = truncate("Hello ", 5);
    expect(result).toBe("Hello…");
  });
});

describe("formatRating()", () => {
  it("returns 5 filled stars for rating 5", () => {
    expect(formatRating(5)).toBe("★★★★★");
  });

  it("returns 1 filled star and 4 empty for rating 1", () => {
    expect(formatRating(1)).toBe("★☆☆☆☆");
  });

  it("returns correct mixed stars for rating 3", () => {
    expect(formatRating(3)).toBe("★★★☆☆");
  });

  it("returns all empty stars for rating 0", () => {
    expect(formatRating(0)).toBe("☆☆☆☆☆");
  });
});
