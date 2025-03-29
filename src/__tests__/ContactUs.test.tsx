import { render, screen } from "@testing-library/react";
import ContactUs from "../pages/ContactUs/ContactUs";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("ContactUs Page", () => {
  it("renders the title correctly", () => {
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );
    expect(screen.getByText("Skicka ett meddelande till oss")).toBeInTheDocument();
  });

  it("renders the ContactForm component", () => {
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });
});
