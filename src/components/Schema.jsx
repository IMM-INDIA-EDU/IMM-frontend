/**
 * Schema component for rendering JSON-LD structured data
 * @param {Object} schema - The schema object to render as JSON-LD
 */
export default function Schema({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0),
      }}
    />
  );
}

