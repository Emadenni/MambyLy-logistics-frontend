/** Date helpers of the admin (Stockholm time, like the previous formatDate). */

const valid = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

/** "29 Oct 2026, 14:05" – compact, for lists. */
export const shortDate = (iso: string) => {
  const d = valid(iso);
  if (!d) return "Unknown date";
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm" });
};

/** "Thursday 29 October 2026, 14:05:09" – full, for the detail view. */
export const longDate = (iso: string) => {
  const d = valid(iso);
  if (!d) return "Unknown date";
  return d.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Stockholm",
  });
};

export const time = (iso: string) => valid(iso)?.getTime() ?? 0;

/** Joi messages name the field in quotes ("firstName" must be …); show the label instead. */
const LABELS: Record<string, string> = { firstName: "First name", lastName: "Last name", email: "Email", password: "Password", profileImage: "Profile image" };
export const readableError = (message: string | null | undefined) =>
  message ? message.replace(/"(\w+)"/g, (_, k: string) => LABELS[k] ?? k) : message;
