/**
 * Legal identity of the business, shown in the Terms, Privacy Policy and
 * Shipping & Returns pages. Greek/EU law requires these to be accurate and
 * easy to find for anyone buying online.
 *
 * TODO before launch: replace every "[…]" placeholder with the real values
 * from the GEMI registration (legal name, legal form, VAT number / ΑΦΜ,
 * tax office / ΔΟΥ).
 */
export const COMPANY = {
  tradeName: "Ellaina Olive Oil",
  legalName: { el: "KALAITZIS ALEXANDROS", en: "ΚΑΛΑΪΤΖΗΣ ΑΛΕΞΑΝΔΡΟΣ" },
  vatNumber: "[031649589]",
  taxOffice: { el: "[ΔΟΥ:Καλλιθέας]", en: "[Tax office: Kallithea]" },
  gemi: "195010503000",
  address: {
    el: "Φρύνης 21, Παγκράτι, Αθήνα, Ελλάδα",
    en: "Frynis 21, Pagkrati, Athens, Greece",
  },
  email: "info@ellainaoliveoil.com",
  phone: "+30 698 765 7362",
} as const;

/** One-line identity statement, e.g. for the top of legal pages. */
export function companyLine(lang: "el" | "en") {
  const c = COMPANY;
  return lang === "el"
    ? `${c.legalName.el} (διακριτικός τίτλος «${c.tradeName}»), ${c.address.el} · ΑΦΜ ${c.vatNumber}, ${c.taxOffice.el} · Αρ. Γ.Ε.ΜΗ. ${c.gemi} · ${c.email} · ${c.phone}`
    : `${c.legalName.en} (trading as "${c.tradeName}"), ${c.address.en} · VAT No. ${c.vatNumber}, ${c.taxOffice.en} · GEMI No. ${c.gemi} · ${c.email} · ${c.phone}`;
}
