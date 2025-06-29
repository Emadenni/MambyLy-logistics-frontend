export const safeParse = (value: string | null): any => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn("Cookie consent danneggiato. Resetting...");
    localStorage.removeItem("cookieConsent");
    return null;
  }
};