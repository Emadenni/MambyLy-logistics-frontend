import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkWithUs from "../pages/WorkWithUs/WorkWithUs";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "../components/ContactForm/ContactForm";
import "@testing-library/jest-dom";

beforeAll(() => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    };
});

describe("WorkWithUs Page", () => {
  it("renders the title and subtitle correctly", () => {
    render(
      <MemoryRouter>
        <WorkWithUs />
      </MemoryRouter>
    );

    expect(screen.getByText("Vill du jobba med oss?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Kolla de lediga tjänsterna eller skicka in en spontanansökan."
      )
    ).toBeInTheDocument();
  });

});


