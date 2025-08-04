export type ToolKey =
  | "catchy"
  | "doolio"
  | "mail"
  | "ai"
  | "offerKit"
  | "clientSide"
  | "chillBooking"
  | "shiftDealer"
  | "brandOn"
  | "fullStock"
  | "pingMe";

export interface ActivityItem {
  id: string;
  tool: ToolKey;
  title: string;
  text: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

/* opzionale: etichette pronte all'uso */
export const TOOL_LABELS: Record<ToolKey, string> = {
  catchy: "Catchy",
  doolio: "Doolio",
  mail: "Mail",
  ai: "AI",
  offerKit: "OfferKit",
  clientSide: "ClientSide",
  chillBooking: "ChillBooking",
  shiftDealer: "ShiftDealer",
  brandOn: "BrandOn",
  fullStock: "FullStock",
  pingMe: "PingMe",
};
