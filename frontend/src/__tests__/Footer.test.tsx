import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("CeylonPrivé")).toBeInTheDocument();
  });

  it("renders the Explore section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });

  it("renders the Contact section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders the Guide Portal link", () => {
    render(<Footer />);
    const portalLink = screen.getByText("Guide Portal");
    expect(portalLink).toBeInTheDocument();
    expect(portalLink.closest("a")).toHaveAttribute("href", "/admin/login");
  });

  it("renders the Sri Lanka location", () => {
    render(<Footer />);
    expect(screen.getByText(/Colombo, Sri Lanka/i)).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<Footer />);
    expect(screen.getByText(/hello@ceylonprive\.com/i)).toBeInTheDocument();
  });

  it("shows the current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("renders navigation links in Explore section", () => {
    render(<Footer />);
    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("AI Planner")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
  });
});
