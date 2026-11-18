import Link from 'next/link';
export default function NotFound() {
  return (
    <main
      id="main"
      className="shell not-found"
      data-guide="missing"
      data-guide-line="Hmm, this page isn't here. Try the roadmap!"
    >
      <span className="eyebrow">404 / AN UNEXPLORED PATH</span>
      <h1>Nothing here just yet.</h1>
      <p>The page may have moved. Everything to learn is on the roadmap.</p>
      <Link href="/" className="button button-primary">
        Open the roadmap ↗
      </Link>
    </main>
  );
}
