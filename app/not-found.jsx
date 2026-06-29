import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero container">
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: "clamp(40px, 9vw, 120px)" }}>
        Lost the
        <br />
        thread
      </h1>
      <p className="sub">
        That page drifted off into the void.{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          Back home
        </Link>
        .
      </p>
    </section>
  );
}
