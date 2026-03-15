"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section" style={{ textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container-narrow">
        <h1 style={{ marginBottom: "16px" }}>Something went wrong</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "17px" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn">
          Try again
        </button>
      </div>
    </section>
  );
}
