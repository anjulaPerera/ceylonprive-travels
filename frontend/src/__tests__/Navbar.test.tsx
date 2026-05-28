import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";

// Mock next-themes since it uses context
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Navbar", () => {
  beforeEach(() => {
    // Reset scroll position before each test
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
  });

  it("renders the brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("CeylonPrivé")).toBeInTheDocument();
    expect(screen.getByText("Travels")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Experience").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gallery").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Planner").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reviews").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
  });

  it("renders the Book Private Tour CTA button", () => {
    render(<Navbar />);
    const ctaButtons = screen.getAllByText("Book Private Tour");
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText("Toggle menu");

    // Mobile menu should not show links initially (they exist in desktop nav)
    // Click to open mobile menu
    fireEvent.click(menuButton);

    // After click, mobile menu should be visible
    // The Theme label only appears in the mobile menu
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("closes mobile menu when a nav link is clicked", () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText("Toggle menu");

    fireEvent.click(menuButton);
    expect(screen.getByText("Theme")).toBeInTheDocument();

    // Click a nav link in the mobile menu
    const experienceLinks = screen.getAllByText("Experience");
    fireEvent.click(experienceLinks[experienceLinks.length - 1]);

    // Theme label should no longer be visible (mobile menu closed)
    expect(screen.queryByText("Theme")).not.toBeInTheDocument();
  });

  it("navbar starts transparent (not scrolled)", () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("bg-transparent");
  });

  it("has correct href attributes on nav links", () => {
    render(<Navbar />);
    const anchorLink = Array.from(
      document.querySelectorAll('a[href="#gallery"]'),
    );
    expect(anchorLink.length).toBeGreaterThan(0);
  });
});
