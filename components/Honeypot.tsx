/**
 * Invisible field that humans never fill in. Bots that auto-fill every
 * input trip it; forms then fake success without saving anything.
 */
export default function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function isBot(form: HTMLFormElement) {
  const value = new FormData(form).get("company_website");
  return typeof value === "string" && value.trim() !== "";
}
