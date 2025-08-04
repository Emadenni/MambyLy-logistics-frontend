import { create } from "zustand";
import type { ActivityItem, ToolKey } from "../types/activity";

type State = {
  items: ActivityItem[];
  loading: boolean;
  hasMore: boolean;
  filters: { tools: ToolKey[]; q: string };
};

type Actions = {
  init: () => Promise<void>;
  loadMore: () => Promise<void>;
  setTools: (tools: ToolKey[]) => void;
  setQuery: (q: string) => void;
  pushItem: (item: ActivityItem) => void;
  reset: () => void;
};

const mockPage = (offset: number, len: number): ActivityItem[] => {
  const base: ActivityItem[] = [
    { id: "1", tool: "catchy",       title: "Catchy",       text: "Ny slogan genererad",                    createdAt: new Date().toISOString() },
    { id: "2", tool: "doolio",       title: "Doolio",       text: "Brief uppdaterad: Sommar 2.0",           createdAt: new Date(Date.now() - 3e6).toISOString() },
    { id: "3", tool: "mail",         title: "Mail Manager", text: "Kampanj ‘Augusti’ schemalagd",           createdAt: new Date(Date.now() - 6e6).toISOString() },
    { id: "4", tool: "ai",           title: "AI Support",   text: "Svar sammanfattning skickad",            createdAt: new Date(Date.now() - 9e6).toISOString() },

    { id: "5", tool: "offerKit",     title: "OfferKit",     text: "Offerta #1042 approvata",                createdAt: new Date(Date.now() - 12e6).toISOString() },
    { id: "6", tool: "clientSide",   title: "ClientSide",   text: "Nuovo cliente importato",                createdAt: new Date(Date.now() - 15e6).toISOString() },
    { id: "7", tool: "chillBooking", title: "ChillBooking", text: "Prenotazione CB-882 confermata",         createdAt: new Date(Date.now() - 18e6).toISOString() },
    { id: "8", tool: "shiftDealer",  title: "ShiftDealer",  text: "Turno notte aggiornato",                 createdAt: new Date(Date.now() - 21e6).toISOString() },
    { id: "9", tool: "brandOn",      title: "BrandOn",      text: "Linea guida brand v2 pubblicata",        createdAt: new Date(Date.now() - 24e6).toISOString() },
    { id: "10", tool: "fullStock",   title: "FullStock",    text: "Stock sincronizzato (32 SKU)",           createdAt: new Date(Date.now() - 27e6).toISOString() },
    { id: "11", tool: "pingMe",      title: "PingMe",       text: "3 notifiche consegnate",                 createdAt: new Date(Date.now() - 30e6).toISOString() },
  ];

  const out: ActivityItem[] = [];
  for (let i = 0; i < len; i++) {
    const b = base[i % base.length];
    out.push({
      ...b,
      id: `${offset + i + 1}-${b.tool}`,
      createdAt: new Date(Date.now() - (offset + i) * 90_000).toISOString(),
    });
  }
  return out;
};


export const useDashboardStore = create<State & Actions>((set, get) => ({
  items: [],
  loading: false,
  hasMore: true,
  filters: { tools: [], q: "" },

  init: async () => {
    set({ loading: true });
    // TODO: qui farai la fetch reale
    const data = mockPage(0, 12);
    set({ items: data, loading: false, hasMore: true });
  },

  loadMore: async () => {
    if (get().loading || !get().hasMore) return;
    set({ loading: true });
    const offset = get().items.length;
    // TODO: fetch paginata reale
    const data = mockPage(offset, 8);
    set({
      items: [...get().items, ...data],
      loading: false,
      hasMore: data.length > 0,
    });
  },

  setTools: (tools) => set((s) => ({ filters: { ...s.filters, tools } })),
  setQuery: (q) => set((s) => ({ filters: { ...s.filters, q } })),
  pushItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  reset: () => set({ items: [], loading: false, hasMore: true, filters: { tools: [], q: "" } }),
}));
