// Light mode is now primary — ThemeProvider is a passthrough.
// Dark mode toggle can be added back later if needed.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
