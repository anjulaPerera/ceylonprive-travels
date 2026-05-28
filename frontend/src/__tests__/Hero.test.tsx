import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/landing/Hero";

describe("Hero", () => {
  it("renders the main headline", () => {
    render(<Hero />);
    expect(screen.getByText("Discover Ceylon")).toBeInTheDocument();
    expect(screen.getByText("Like Never Before")).toBeInTheDocument();
  });

  it("renders the eyebrow text", () => {
    render(<Hero />);
    expect(screen.getByText(/Private Luxury Tours/i)).toBeInTheDocument();
  });

  it("renders the subheading description", () => {
    render(<Hero />);
    expect(screen.getByText(/ancient temples/i)).toBeInTheDocument();
  });

  it("renders Plan Your Journey CTA button", () => {
    render(<Hero />);
    expect(screen.getByText("Plan Your Journey")).toBeInTheDocument();
  });

  it("renders AI Itinerary Planner CTA button", () => {
    render(<Hero />);
    expect(screen.getByText("AI Itinerary Planner")).toBeInTheDocument();
  });

  it("CTA buttons have correct href attributes", () => {
    render(<Hero />);
    const planButton = screen.getByText("Plan Your Journey").closest("a");
    const aiButton = screen.getByText("AI Itinerary Planner").closest("a");

    expect(planButton).toHaveAttribute("href", "#contact");
    expect(aiButton).toHaveAttribute("href", "#ai-planner");
  });

  it("renders scroll indicator", () => {
    render(<Hero />);
    expect(screen.getByText("Scroll")).toBeInTheDocument();
  });

  it("renders the Est. 2015 decorative text", () => {
    render(<Hero />);
    expect(screen.getByText(/Est\. 2015/i)).toBeInTheDocument();
  });
});
