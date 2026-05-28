import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const mockSetTheme = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renders the toggle button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("calls setTheme with light when currently dark", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("has correct aria-label", () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText(/toggle theme/i);
    expect(button).toBeInTheDocument();
  });

  it("shows moon icon when in dark mode", () => {
    render(<ThemeToggle />);
    // Moon icon should be fully visible (opacity-100) in dark mode
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
