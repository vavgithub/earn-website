/**
 * Studio shell — pass through only (NextStudio owns the UI).
 * Keeps /studio out of marketing chrome; pairs with page.tsx + [...index]/page.tsx.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
