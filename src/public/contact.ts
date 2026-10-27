/**
 * Public MambyLy contact details – single source for the site. The e-mail is the address already
 * used on the site and on MambyLy's card (domain mambylysolutions.se, like the website).
 */
const WHATSAPP_GREETING = "Hej! Jag besökte din webbplats och vill veta mer!";

export const publicContact = {
  phoneNational: "072 211 64 22",
  phoneInternational: "+46 72 211 64 22",
  phoneHref: "tel:+46722116422",
  phoneE164: "+46722116422",
  whatsappUrl: "https://wa.me/46722116422",
  email: "info@mambylysolutions.se",
  whatsappGreetingUrl: `https://wa.me/46722116422?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
} as const;
