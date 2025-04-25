import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import ContactsListBox from "../components/ContactsListBox/ContactsListBox";
import AboutUs from "../pages/AboutUs/AboutUs";
import { teamMembersData } from "../components/data/teamMembers";
import React from "react";

vi.mock("../components/Layout/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../components/Carousel/Carousel", () => ({
  default: () => <div data-testid="carousel"></div>,
}));

vi.mock("../components/TitleBox/TitleBox", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../components/SocialBox/SocialBox", () => ({
  default: () => <div data-testid="social-box"></div>,
}));

describe("ContactsListBox & AboutUs Components", () => {
  it("renders contact information", () => {
    render(<ContactsListBox />);
    expect(screen.getByText((content) => content.includes("Våra kontakter"))).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(<ContactsListBox />);
    expect(screen.getByText((content) => content.includes("Följ oss på sociala medier"))).toBeInTheDocument();
    expect(screen.getByTestId("social-box")).toBeInTheDocument();
  });

  it("renders team members", async () => {
    render(<ContactsListBox />);
    for (const member of teamMembersData) {
      expect(await screen.findByText(member.name)).toBeInTheDocument();
    }
  });

  /*   it("renders the main text", () => {
    render(<AboutUs />);
    expect(screen.getByText((content) => content.includes("Mambyly Logistics"))).toBeInTheDocument();
  }); */

  /*  it("renders the carousel", () => {
    render(<AboutUs />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("renders the contacts list", () => {
    render(<AboutUs />);
    expect(screen.getByTestId("contacts-list-box")).toBeInTheDocument();
  }); */
});
