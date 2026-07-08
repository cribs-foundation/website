// renders portable text as inline plain-styled paragraphs, for places (vision
// card, pull statements) where we want the display face rather than the body
// paragraph treatment of the full PortableText renderer.
export function PortableTextPlain({
  value,
}: {
  value: Array<{ children?: Array<{ text?: string }> }> | null | undefined;
}) {
  if (!value) return null;
  const text = value
    .map((block) => (block.children ?? []).map((c) => c.text ?? "").join(""))
    .filter(Boolean);
  return (
    <>
      {text.map((t, i) => (
        <p key={i} className={i > 0 ? "mt-3" : ""}>
          {t}
        </p>
      ))}
    </>
  );
}
