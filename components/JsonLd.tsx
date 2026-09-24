/*
 * Renders schema.org structured data as a JSON-LD script tag.
 * Server component — the JSON ends up in the initial HTML where crawlers read it.
 * `<` is escaped so content can never close the script tag early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
