import emailjs from "@emailjs/browser";
import { nanoid } from "nanoid";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TO_EMAIL = "info@mambylysolutions.se"; // Può essere messo in env se preferisci

const sendOrderConfirmation = async () => {
  const project_name = localStorage.getItem("project_name") || "Unnamed Project";
  const order_id = `${project_name.replace(/\s+/g, "_")}_${nanoid(6).toUpperCase()}`;

  const company_name = localStorage.getItem("company_name") || "-";
  const email = localStorage.getItem("email") || "-";
  const has_domain = localStorage.getItem("has_domain") === "true" ? "Ja" : "Nej";
  const domain_name = localStorage.getItem("domain_name") || "-";
  const content_via_demo = localStorage.getItem("content_via_demo") === "true" ? "Ja" : "Nej";
  const section_changes = localStorage.getItem("section_changes") || "-";
  const static_page_description = localStorage.getItem("static_page_description") || "-";
  const include_free_page = localStorage.getItem("include_free_page") === "true" ? "Ja" : "Nej";
  const final_notes = localStorage.getItem("final_notes") || "-";

  // Estrai e formatta lista di extra selezionati
  let extras_list = "Inga";
  try {
    const selected_extras = JSON.parse(localStorage.getItem("selected_extras") || "[]");
    extras_list = Array.isArray(selected_extras) && selected_extras.length > 0
      ? selected_extras.join(", ")
      : "Inga";
  } catch {
    extras_list = "Inga";
  }

  // Estrai e formatta pagine extra a pagamento
  let paid_extra_pages = "Inga";
  try {
    const parsedPages = JSON.parse(localStorage.getItem("paid_extra_pages") || "[]");
    paid_extra_pages = Array.isArray(parsedPages) && parsedPages.length > 0
      ? parsedPages.join(", ")
      : "Inga";
  } catch {
    paid_extra_pages = "Inga";
  }

  const total_price = localStorage.getItem("total_price") || "0";
  const advance_payment = localStorage.getItem("advance_payment") || "0";
  const remaining_payment = localStorage.getItem("remaining_payment") || "0";

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { success: false, error: "Missing EmailJS environment variables" };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: TO_EMAIL,
        order_id,
        project_name,
        company_name,
        email,
        has_domain,
        domain_name,
        content_via_demo,
        selected_extras: extras_list,
        section_changes,
        static_page_description,
        include_free_page,
        paid_extra_pages,
        final_notes,
        total_price,
        advance_payment,
        remaining_payment,
      },
      PUBLIC_KEY
    );

    return { success: true, order_id };
  } catch (error) {
    return { success: false, error };
  }
};

export default sendOrderConfirmation;
