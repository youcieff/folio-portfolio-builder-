/**
 * Brutalist template CSS
 *
 * Personality: 3px black borders, hard shadows (no blur), radius 0,
 * UPPERCASE headings, intentionally off-grid.
 * bg: #F2F0E6  ink: #000  accent lemon: #F5E400
 * Fonts: Space Mono + IBM Plex Mono
 */
export const brutalistCss = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #F2F0E6;
    color: #000;
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
  }

  .site-wrap { max-width: 900px; margin: 0 auto; padding: 0 28px; }

  /* ── Hero ────────────────────────────────────────────────────────────── */
  .block-hero {
    padding-block: 80px 64px;
    border-block-end: 3px solid #000;
    margin-block-end: 64px;
  }

  .hero-label {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-block-end: 20px;
    display: block;
    color: rgba(0,0,0,0.4);
  }

  .hero-heading {
    font-family: 'Space Mono', monospace;
    font-size: clamp(2rem, 6vw, 4.5rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1.05;
    margin-block-end: 24px;
    word-break: break-word;
    /* Intentionally off by a few px — the "brutalist hand" */
    margin-inline-start: -2px;
  }

  .hero-subline {
    font-size: 0.92rem;
    color: rgba(0,0,0,0.6);
    max-width: 60ch;
    margin-block-end: 36px;
    line-height: 1.65;
  }

  .hero-cta {
    display: inline-block;
    padding: 12px 24px;
    background: #F5E400;
    border: 3px solid #000;
    color: #000;
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    box-shadow: 4px 4px 0 #000;
    transition: transform 0.08s, box-shadow 0.08s;
  }
  .hero-cta:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
  .hero-cta:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }

  .hero-avatar {
    width: 96px; height: 96px;
    border: 3px solid #000;
    object-fit: cover;
    margin-block-end: 24px;
    box-shadow: 6px 6px 0 #000;
    display: block;
  }

  /* ── Sections ────────────────────────────────────────────────────────── */
  .site-section { margin-block-end: 72px; }

  .section-heading {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-block-end: 32px;
    padding-block-end: 12px;
    border-block-end: 3px solid #000;
  }

  /* ── About ───────────────────────────────────────────────────────────── */
  .about-body {
    font-size: 0.92rem;
    line-height: 1.75;
    max-width: 68ch;
    color: rgba(0,0,0,0.8);
  }

  .about-facts {
    margin-block-start: 28px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0;
  }
  .fact-item {
    padding: 16px;
    border: 1.5px solid #000;
    margin-inline-end: -1.5px;
    margin-block-end: -1.5px;
  }
  .fact-label {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(0,0,0,0.4);
    display: block;
    margin-block-end: 4px;
  }
  .fact-value { font-family: 'Space Mono', monospace; font-size: 0.88rem; }

  /* ── Projects ────────────────────────────────────────────────────────── */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0;
  }

  .proj-card {
    border: 3px solid #000;
    padding: 20px;
    margin-inline-end: -3px;
    margin-block-end: -3px;
    box-shadow: 4px 4px 0 #000;
    background: #F2F0E6;
    transition: transform 0.08s, box-shadow 0.08s;
  }
  .proj-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
    background: #F5E400;
  }

  .proj-name {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.92rem;
    text-transform: uppercase;
    margin-block-end: 8px;
  }
  .proj-name a { color: #000; text-decoration: none; }

  .proj-desc { font-size: 0.82rem; line-height: 1.6; margin-block-end: 12px; color: rgba(0,0,0,0.65); }

  .proj-meta { font-size: 0.72rem; color: rgba(0,0,0,0.4); margin-block-end: 10px; }

  .proj-topics {
    display: flex; flex-wrap: wrap; gap: 4px;
    list-style: none; padding: 0; margin-block-end: 12px;
  }
  .proj-topic {
    font-size: 0.62rem;
    padding: 2px 6px;
    border: 1.5px solid #000;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .proj-links { display: flex; gap: 12px; }
  .proj-link {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    font-weight: 700;
    color: #000;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-block-end: 2px solid transparent;
  }
  .proj-link:hover { border-block-end-color: #000; }

  /* ── Skills ──────────────────────────────────────────────────────────── */
  .skill-group { margin-block-end: 24px; }
  .skill-group-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-block-end: 10px;
    color: rgba(0,0,0,0.45);
  }
  .skill-list { display: flex; flex-wrap: wrap; gap: 0; list-style: none; padding: 0; }
  .skill-item {
    padding: 6px 14px;
    border: 1.5px solid #000;
    font-size: 0.82rem;
    margin-inline-end: -1.5px;
    margin-block-end: -1.5px;
    background: #F2F0E6;
  }
  .skill-item:hover { background: #F5E400; }

  /* ── Timeline ────────────────────────────────────────────────────────── */
  .timeline { list-style: none; padding: 0; }
  .timeline-entry {
    padding-block: 24px;
    border-block-end: 3px solid #000;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px;
  }
  .entry-period {
    font-size: 0.72rem;
    font-family: 'Space Mono', monospace;
    color: rgba(0,0,0,0.4);
    padding-block-start: 2px;
  }
  .entry-role {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.92rem;
    text-transform: uppercase;
  }
  .entry-org { font-size: 0.85rem; margin-block-end: 6px; color: rgba(0,0,0,0.55); }
  .entry-desc { font-size: 0.85rem; line-height: 1.65; color: rgba(0,0,0,0.7); }

  /* ── Contact ─────────────────────────────────────────────────────────── */
  .contact-note { font-size: 0.92rem; max-width: 60ch; margin-block-end: 28px; color: rgba(0,0,0,0.65); }
  .contact-links { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; }
  .contact-link-item a {
    display: inline-block;
    padding: 10px 20px;
    border: 3px solid #000;
    color: #000;
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    box-shadow: 4px 4px 0 #000;
    transition: transform 0.08s, box-shadow 0.08s, background 0.08s;
  }
  .contact-link-item a:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
    background: #F5E400;
  }
  .contact-platform { display: none; } /* platform shown in link text */

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .site-footer {
    padding-block: 28px 48px;
    border-block-start: 3px solid #000;
    font-size: 0.72rem;
    font-family: 'Space Mono', monospace;
    color: rgba(0,0,0,0.3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;
