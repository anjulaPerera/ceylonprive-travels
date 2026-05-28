import React from "react";
import { render, screen } from "@testing-library/react";
import Experience from "@/components/landing/Experience";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe("Experience section", () => {
  it("renders the section heading", () => {
    render(<Experience />);
    expect(screen.getByText("Sri Lanka, Revealed")).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<Experience />);
    expect(screen.getByText("The CeylonPrivé Difference")).toBeInTheDocument();
  });

  it("renders all three stat cards", () => {
    render(<Experience />);
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
  });

  it("renders stat labels", () => {
    render(<Experience />);
    expect(screen.getByText("Years of Expertise")).toBeInTheDocument();
    expect(screen.getByText("Private Tours")).toBeInTheDocument();
    expect(screen.getByText("5-Star Reviews")).toBeInTheDocument();
  });

  it("renders the Begin Your Story CTA link", () => {
    render(<Experience />);
    expect(screen.getByText("Begin Your Story")).toBeInTheDocument();
    const link = screen.getByText("Begin Your Story").closest("a");
    expect(link).toHaveAttribute("href", "#contact");
  });

  it("renders the narrative paragraph about Sri Lanka", () => {
    render(<Experience />);
    expect(
      screen.getByText(/Sri Lanka is not a destination/i),
    ).toBeInTheDocument();
  });

  it("has the correct section id for anchor navigation", () => {
    render(<Experience />);
    const section = document.getElementById("experience");
    expect(section).not.toBeNull();
  });
});
