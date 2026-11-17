import Link from 'next/link';
export default function NotFound() {
  return (
    <main
      id="main"
      className="shell not-found"
      data-guide="missing"
      data-guide-line="Hmm, this page isn't here. Try the courses!"
    >
      <span className="eyebrow">404 / AN UNEXPLORED PATH</span>
      <h1>Nothing here just yet.</h1>
      <p>The page may have moved. There’s more to explore in the courses.</p>
      <Link href="/#courses" className="button button-primary">
        Explore the courses ↗
      </Link>
    </main>
  );
}
