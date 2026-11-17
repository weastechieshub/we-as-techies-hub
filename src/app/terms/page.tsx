import { getTerms } from '@/lib/content';
import { Markdown } from '@/components/markdown';
import { pageMetadata } from '@/lib/seo';

export function generateMetadata() {
  const terms = getTerms();
  return pageMetadata(terms.title, terms.description, '/terms');
}

export default function TermsPage() {
  const terms = getTerms();
  return (
    <main id="main">
      <article
        className="shell legal-page"
        data-guide="terms"
        data-guide-line="The fine print, kept short and simple."
      >
        <header className="legal-heading">
          <h1>{terms.title}</h1>
          <p className="mono">LAST UPDATED {terms.updated.toUpperCase()}</p>
        </header>
        <Markdown>{terms.body}</Markdown>
      </article>
    </main>
  );
}
