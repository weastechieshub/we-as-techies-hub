import type { NextConfig } from 'next';

// The site is built to plain static files in `out/` and hosted on GitHub Pages
// (see .github/workflows/deploy.yml), so it uses no server features.
const config: NextConfig = {
  output: 'export',
};

export default config;
