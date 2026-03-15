import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container-narrow">
        <h1 style={{ marginBottom: "16px" }}>404 — Page not found</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "17px" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  );
}
