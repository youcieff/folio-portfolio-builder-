/**
 * Midnight Glass template CSS
 *
 * Personality: depth and light — dark bg, glass cards, soft mint accent.
 * bg: #0B0F14  glass: rgba(255,255,255,.06)  accent mint: #7CF2C4
 * Fonts: Space Grotesk (headings) + Inter (body)
 */
export const midnightGlassCss = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #0B0F14;
    color: #D9E4EF;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.65;
    min-height: 100vh;
  }

  /* Subtle noise texture */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9998;
  }

  .site-wrap { max-width: 960px; margin: 0 auto; padding: 0 32px; }

  /* ── Hero ────────────────────────────────────────────────────────────── */
  .block-hero {
    padding-block: 120px 80px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 40px;
  }

  .hero-heading {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: clamp(2.2rem, 6vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    background: linear-gradient(135deg, #D9E4EF 0%, #7CF2C4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-block-end: 20px;
    word-break: break-word;
  }

  .hero-subline {
    font-size: 1.05rem;
    color: rgba(217,228,239,0.65);
    max-width: 55ch;
    margin-block-end: 36px;
  }

  .hero-cta {
    display: inline-block;
    padding: 12px 28px;
    background: rgba(124,242,196,0.1);
    border: 1px solid rgba(124,242,196,0.35);
    color: #7CF2C4;
    text-decoration: none;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    border-radius: 6px;
    transition: background 0.2s, border-color 0.2s;
    backdrop-filter: blur(8px);
  }
  .hero-cta:hover {
    background: rgba(124,242,196,0.18);
    border-color: rgba(124,242,196,0.6);
  }

  .hero-avatar {
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 2px solid rgba(124,242,196,0.25);
    object-fit: cover;
    box-shadow: 0 0 40px rgba(124,242,196,0.08);
  }

  /* ── Sections ────────────────────────────────────────────────────────── */
  .site-section { margin-block-end: 80px; }

  .section-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7CF2C4;
    margin-block-end: 32px;
  }

  /* Glass card — used by projects, timeline */
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(16px);
    transition: background 0.2s, border-color 0.2s;
  }
  .glass-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(124,242,196,0.15);
  }

  /* ── About ───────────────────────────────────────────────────────────── */
  .about-body {
    color: rgba(217,228,239,0.8);
    line-height: 1.8;
    max-width: 68ch;
    margin-block-end: 32px;
  }

  .about-facts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  .fact-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    padding: 16px;
  }
  .fact-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(217,228,239,0.35);
    display: block;
    margin-block-end: 4px;
  }
  .fact-value { color: #D9E4EF; font-size: 0.95rem; }

  /* ── Projects ────────────────────────────────────────────────────────── */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .proj-card { position: relative; overflow: hidden; }
  /* Focused glow: only on :focus-within and :hover */
  .proj-card:focus-within,
  .proj-card:hover {
    box-shadow: 0 0 30px rgba(124,242,196,0.06);
  }

  .proj-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    margin-block-end: 8px;
  }
  .proj-name a { color: #7CF2C4; text-decoration: none; }
  .proj-name a:hover { text-decoration: underline; }

  .proj-desc {
    color: rgba(217,228,239,0.65);
    font-size: 0.88rem;
    line-height: 1.6;
    margin-block-end: 16px;
  }

  .proj-meta {
    display: flex; align-items: center; gap: 16px;
    font-size: 0.75rem;
    color: rgba(217,228,239,0.35);
    margin-block-end: 12px;
  }

  .proj-topics {
    display: flex; flex-wrap: wrap; gap: 6px;
    list-style: none; padding: 0;
  }
  .proj-topic {
    font-size: 0.65rem;
    padding: 3px 8px;
    background: rgba(124,242,196,0.06);
    border: 1px solid rgba(124,242,196,0.15);
    border-radius: 100px;
    color: rgba(124,242,196,0.75);
  }

  .proj-links { margin-block-start: 16px; display: flex; gap: 12px; }
  .proj-link {
    font-size: 0.78rem;
    color: rgba(217,228,239,0.5);
    text-decoration: none;
  }
  .proj-link:hover { color: #7CF2C4; }

  /* ── Skills ──────────────────────────────────────────────────────────── */
  .skill-group { margin-block-end: 24px; }
  .skill-group-label {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(217,228,239,0.35);
    margin-block-end: 12px;
  }
  .skill-list { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; }
  .skill-item {
    padding: 6px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    font-size: 0.84rem;
    color: rgba(217,228,239,0.8);
    transition: border-color 0.15s;
  }
  .skill-item:hover { border-color: rgba(124,242,196,0.25); }

  /* ── Timeline ────────────────────────────────────────────────────────── */
  .timeline { list-style: none; padding: 0; }
  .timeline-entry { margin-block-end: 24px; }

  .entry-period {
    font-size: 0.72rem;
    color: rgba(217,228,239,0.35);
    margin-block-end: 4px;
  }
  .entry-role {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #D9E4EF;
  }
  .entry-org { color: #7CF2C4; font-size: 0.88rem; margin-block-end: 8px; }
  .entry-desc { color: rgba(217,228,239,0.65); font-size: 0.9rem; line-height: 1.65; }

  /* ── Contact ─────────────────────────────────────────────────────────── */
  .contact-note {
    color: rgba(217,228,239,0.65);
    max-width: 56ch;
    margin-block-end: 28px;
  }
  .contact-links { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; }
  .contact-link-item a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: rgba(217,228,239,0.8);
    text-decoration: none;
    font-size: 0.9rem;
    transition: border-color 0.15s, color 0.15s;
    backdrop-filter: blur(8px);
  }
  .contact-link-item a:hover { border-color: rgba(124,242,196,0.35); color: #7CF2C4; }
  .contact-platform { font-size: 0.72rem; opacity: 0.45; }

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .site-footer {
    border-block-start: 1px solid rgba(255,255,255,0.06);
    padding-block: 28px 48px;
    font-size: 0.75rem;
    color: rgba(217,228,239,0.2);
  }
`;
