import { create } from "zustand";

type OrderFields =
  | "project_name"
  | "company_name"
  | "email"
  | "has_domain"
  | "domain_name"
  | "content_via_demo"
  | "selected_extras"
  | "section_changes"
  | "include_free_page"
  | "paid_extra_pages"
  | "static_page_description"
  | "final_notes"
  | "total_price"
  | "advance_payment"
  | "remaining_payment";

type OrderData = {
  [K in OrderFields]: string | string[]; // Puoi raffinare i tipi se vuoi precisione maggiore
};

interface OrderStore {
  order: Partial<OrderData>;
  updateOrderField: <K extends OrderFields>(field: K, value: OrderData[K]) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {},
  updateOrderField: (field, value) => {
    set((state) => {
      const updatedOrder = { ...state.order, [field]: value };

      // Salva anche in localStorage
      localStorage.setItem(field, typeof value === "string" ? value : JSON.stringify(value));

      return { order: updatedOrder };
    });
  },
}));
