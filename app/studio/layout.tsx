// isolates the embedded studio from the marketing site chrome.
// NextStudio renders its own full-screen shell, so just pass children through.
export const metadata = {
  title: "CRIBS Foundation Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
