import type { Format } from "../engine/types";
import franPapperTillDigitalt from "./fran-papper-till-digitalt";

/** Every video format the studio can render, by id (?format=<id>). */
export const formats: Record<string, Format> = {
  [franPapperTillDigitalt.id]: franPapperTillDigitalt,
};
