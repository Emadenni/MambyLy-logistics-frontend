import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import Services from "../pages/Services/Services";
import ServicesCard from "../components/ServicesCard/ServicesCard";
import { vi } from "vitest";
import { microservicesData } from "../components/data/microservices";
import MicroserviceCard from "../components/MicroservicesCard/MicroservicesCard";

beforeAll(() => {
  global.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

const TestRouter = () => {
  return (
    <Routes>
      <Route path="/tjänster" element={<Services />} />
      <Route path="/kontaktaOss" element={<div>Contact Us</div>} />
    </Routes>
  );
};

test("should render microservices cards in the Transport section", () => {
  render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  );

  const transportSection = screen.getByTestId("service1-section");
  expect(transportSection).toBeInTheDocument();

  microservicesData.transport.forEach((microservice) => {
    const microserviceCard = screen.getByTestId(`microservice-card-${microservice.id}`);
    expect(microserviceCard).toBeInTheDocument();
    expect(microserviceCard).toHaveTextContent(microservice.title);
    expect(microserviceCard).toHaveTextContent(microservice.description);
  });
});

test("should render microservices cards in the Digital section", () => {
  render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  );

  const digitalSection = screen.getByTestId("digital-section-title");
  expect(digitalSection).toBeInTheDocument();

  microservicesData.digital.forEach((microservice) => {
    const microserviceCard = screen.getByTestId(`microservice-card-${microservice.id}`);
    expect(microserviceCard).toBeInTheDocument();
    expect(microserviceCard).toHaveTextContent(microservice.title);
    expect(microserviceCard).toHaveTextContent(microservice.description);
  });
});

test("should render the service card correctly", () => {
  const mockService = {
    id: "service1",
    title: "Service 1",
    shortDescription: "Short Desc about Item",
    image: "image-url",
    color: "#000",
    background_color: "#fff",
  };

  render(
    <MemoryRouter>
      <ServicesCard {...mockService} />
    </MemoryRouter>
  );

  const serviceCard = screen.getByTestId("service-card-service1");
  expect(serviceCard).toBeInTheDocument();
  expect(serviceCard).toHaveTextContent("Service 1");
  expect(serviceCard).toHaveTextContent("Short Desc about Item");
});

test("should scroll to the correct section based on the hash in the URL", () => {
  vi.spyOn(window, "matchMedia").mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  const scrollIntoViewMock = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  window.history.pushState({}, "Test page", "/tjänster#service1");

  render(
    <MemoryRouter initialEntries={["/tjänster#service1"]}>
      <Services />
    </MemoryRouter>
  );

  expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

  const service1Section = screen.getByTestId("service1-section");
  expect(service1Section).toBeTruthy();
});

const MockNavigate = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/tjänster" element={<Services />} />
      <Route path="/kontaktaOss" element={<div data-testid="contacts-page">Contacts Page</div>} />
    </Routes>
  );
};

test("should navigate to the contacts page when the 'Fråga Oss' button is clicked", () => {
  render(
    <MemoryRouter initialEntries={["/tjänster"]}>
      <MockNavigate />
    </MemoryRouter>
  );

  const questionButtons = screen.getAllByRole("button", { name: /Fråga Oss/i });

  questionButtons.forEach((questionButton) => {
    fireEvent.click(questionButton);

    expect(screen.getByTestId("contacts-page")).toBeInTheDocument();
  });
});
