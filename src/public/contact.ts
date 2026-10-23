/**
 * Public MambyLy phone / WhatsApp details – single source for the site.
 * (E-mail addresses are intentionally not centralised here yet: the owner has still to
 * confirm which address is correct, see docs/RESTYLE-PUBLIC.md.)
 */
const WHATSAPP_GREETING = "Hej! Jag besökte din webbplats och vill veta mer!";

export const publicContact = {
  phoneNational: "072 211 64 22",
  phoneInternational: "+46 72 211 64 22",
  phoneHref: "tel:+46722116422",
  phoneE164: "+46722116422",
  whatsappUrl: "https://wa.me/46722116422",
  whatsappGreetingUrl: `https://wa.me/46722116422?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
} as const;
