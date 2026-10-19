/**
 * Terminal template CSS
 *
 * Personality: ~/portfolio $ — everything looks like a shell session.
 * bg: #0A0E0A  text: #C9F2C7  accent: amber #FFB000
 * Font: JetBrains Mono everywhere (served via Google Fonts link in theme)
 */
export const terminalCss = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #0A0E0A;
    color: #C9F2C7;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 15px;
    line-height: 1.7;
    min-height: 100vh;
  }

  /* Faint scanline overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.07) 2px,
      rgba(0,0,0,0.07) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .site-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px; }

  /* ── Header / Hero ──────────────────────────────────────────────────── */
  .block-hero {
    padding-block: 80px 60px;
    border-block-end: 1px solid rgba(201,242,199,0.12);
    margin-block-end: 56px;
  }

  .hero-heading {
    font-size: clamp(1.8rem, 5vw, 3.2rem);
    font-weight: 700;
    color: #C9F2C7;
    line-height: 1.15;
    margin-block-end: 16px;
    word-break: break-word;
  }

  .hero-subline {
    color: rgba(201,242,199,0.7);
    font-size: 1rem;
    max-width: 60ch;
    margin-block-end: 32px;
  }

  .hero-cta {
    display: inline-block;
    padding: 10px 24px;
    border: 1.5px solid #FFB000;
    color: #FFB000;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    transition: background 0.15s, color 0.15s;
  }
  .hero-cta:hover { background: #FFB000; color: #0A0E0A; }

  .hero-avatar {
    width: 80px; height: 80px;
    border-radius: 4px;
    border: 1.5px solid rgba(201,242,199,0.2);
    object-fit: cover;
    margin-block-end: 24px;
    display: block;
  }

  /* ── Sections ────────────────────────────────────────────────────────── */
  .site-section { margin-block-end: 64px; }

  .section-heading {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #FFB000;
    margin-block-end: 24px;
  }

  /* ── About ───────────────────────────────────────────────────────────── */
  .about-body {
    color: rgba(201,242,199,0.85);
    line-height: 1.75;
    max-width: 72ch;
  }

  .about-facts {
    margin-block-start: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .fact-item {
    padding: 10px 14px;
    border: 1px solid rgba(201,242,199,0.12);
    background: rgba(201,242,199,0.03);
  }

  .fact-label {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(201,242,199,0.45);
    display: block;
    margin-block-end: 4px;
  }

  .fact-value { color: #C9F2C7; }

  /* ── Projects — ls -la style ─────────────────────────────────────────── */
  .projects-table {
    width: 100%;
    border-collapse: collapse;
  }

  .projects-table thead { color: rgba(201,242,199,0.4); font-size: 0.72rem; }
  .projects-table th,
  .projects-table td {
    padding: 8px 12px;
    text-align: start;
    border-block-end: 1px solid rgba(201,242,199,0.07);
  }
  .projects-table tbody tr:hover { background: rgba(201,242,199,0.04); }

  .proj-name { color: #FFB000; font-weight: 600; }
  .proj-name a { color: inherit; text-decoration: none; }
  .proj-name a:hover { text-decoration: underline; }
  .proj-desc { color: rgba(201,242,199,0.7); font-size: 0.88rem; }
  .proj-stars { color: rgba(201,242,199,0.4); white-space: nowrap; }
  .proj-lang  { color: rgba(201,242,199,0.45); white-space: nowrap; }

  .proj-topics {
    display: flex; flex-wrap: wrap; gap: 6px;
    list-style: none; padding: 0; margin-block-start: 4px;
  }
  .proj-topic {
    font-size: 0.68rem;
    padding: 2px 6px;
    border: 1px solid rgba(255,176,0,0.3);
    color: rgba(255,176,0,0.8);
  }

  /* ── Skills ──────────────────────────────────────────────────────────── */
  .skill-group { margin-block-end: 20px; }
  .skill-group-label {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(201,242,199,0.45);
    margin-block-end: 8px;
  }
  .skill-list {
    display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0;
  }
  .skill-item {
    padding: 4px 10px;
    border: 1px solid rgba(201,242,199,0.15);
    font-size: 0.85rem;
    color: #C9F2C7;
  }

  /* ── Timeline ────────────────────────────────────────────────────────── */
  .timeline { list-style: none; padding: 0; }
  .timeline-entry { display: grid; grid-template-columns: 110px 1fr; gap: 16px; margin-block-end: 32px; }
  .entry-period {
    color: rgba(201,242,199,0.4);
    font-size: 0.78rem;
    padding-block-start: 2px;
    white-space: nowrap;
  }
  .entry-role { font-weight: 600; color: #C9F2C7; }
  .entry-org  { color: #FFB000; font-size: 0.88rem; margin-block-end: 4px; }
  .entry-desc { color: rgba(201,242,199,0.7); font-size: 0.88rem; line-height: 1.65; }

  /* ── Contact ─────────────────────────────────────────────────────────── */
  .contact-note {
    color: rgba(201,242,199,0.7);
    max-width: 60ch;
    margin-block-end: 24px;
  }
  .contact-links { list-style: none; padding: 0; }
  .contact-link-item { margin-block-end: 8px; }
  .contact-link-item a {
    color: #FFB000;
    text-decoration: none;
  }
  .contact-link-item a:hover { text-decoration: underline; }
  .contact-platform {
    color: rgba(201,242,199,0.4);
    font-size: 0.78rem;
    margin-inline-end: 8px;
  }
  .contact-platform::before { content: '→ '; }

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .site-footer {
    border-block-start: 1px solid rgba(201,242,199,0.08);
    padding-block: 24px 40px;
    font-size: 0.75rem;
    color: rgba(201,242,199,0.25);
  }
`;
