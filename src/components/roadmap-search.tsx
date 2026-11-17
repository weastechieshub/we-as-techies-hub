'use client';
import type { ReactNode } from 'react';
import { ArrowUpRight, Search, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';

// Search box for a roadmap page. Results filter as you type; the suggestions fill in a topic,
// and `children` (the roadmap picker) sits underneath.
export function RoadmapSearch({
  query,
  onQueryChange,
  suggestions,
  children,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  children?: ReactNode;
}) {
  return (
    <div className="discovery-search">
      <div className="search-caption">
        <Sparkles size={14} />
        <span>LOOKING FOR SOMETHING SPECIFIC?</span>
        <span className="search-caption-end">SEARCH THIS ROADMAP</span>
      </div>
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <Search size={19} />
        <label className="sr-only" htmlFor="topic-query">
          Search this roadmap
        </label>
        <input
          id="topic-query"
          value={query}
          maxLength={400}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="What are you working on?"
        />
        {query && (
          <button
            type="button"
            className="clear-search"
            aria-label="Clear search"
            onClick={() => onQueryChange('')}
          >
            <X size={16} />
          </button>
        )}
        <Button type="submit">
          <ArrowUpRight size={16} />
          Search
        </Button>
      </form>
      <div className="search-suggestions">
        <span>Try a topic</span>
        {suggestions.map((q) => (
          <button type="button" key={q} onClick={() => onQueryChange(q)}>
            {q}
            <ArrowUpRight size={12} />
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
