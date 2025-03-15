import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "../components/ContactForm/ContactForm";
import "@testing-library/jest-dom";

test("renders the contact form", () => {
  render(<ContactForm subjectFromCard="Test Subject" />);

  expect(screen.getByLabelText(/namn/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/meddelande/i)).toBeInTheDocument();
  expect(screen.getByText(/skicka/i)).toBeInTheDocument();
});

test("submits form with data", async () => {
  render(<ContactForm subjectFromCard="Test Subject" />);

  fireEvent.change(screen.getByLabelText(/namn/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText(/e-post/i), { target: { value: "john@example.com" } });
  fireEvent.change(screen.getByLabelText(/meddelande/i), { target: { value: "Test message" } });

  fireEvent.click(screen.getByText(/skicka/i));

  await waitFor(() => {
    expect(screen.getByText(/tack! ditt meddelande har skickats./i)).toBeInTheDocument();
  });
});

test("does not show file input for non-job application", () => {
  render(<ContactForm subjectFromCard="Test Subject" />);

  expect(screen.queryByText(/ladda upp ditt cv/i)).not.toBeInTheDocument();
});
