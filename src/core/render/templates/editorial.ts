/**
 * Editorial template CSS
 *
 * Personality: generous whitespace, large section numerals (01, 02),
 * thin rules, 4:5 image ratios. Sample persona: a photographer from Alexandria.
 * bg: #FAF7F0  ink: #161412  accent cobalt: #2437D6
 * Fonts: Newsreader (huge headings) + Source Serif 4 (body)
 */
export const editorialCss = `
  @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,700;1,6..72,300;1,6..72,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #FAF7F0;
    color: #161412;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 17px;
    line-height: 1.7;
    min-height: 100vh;
  }

  .site-wrap { max-width: 900px; margin: 0 auto; padding: 0 40px; }

  /* ── Hero ────────────────────────────────────────────────────────────── */
  .block-hero {
    padding-block: 100px 72px;
    border-block-end: 1px solid rgba(22,20,18,0.12);
    margin-block-end: 80px;
  }

  .hero-eyebrow {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.8rem;
    font-style: italic;
    letter-spacing: 0.06em;
    color: rgba(22,20,18,0.45);
    margin-block-end: 24px;
    display: block;
  }

  .hero-heading {
    font-family: 'Newsreader', Georgia, serif;
    font-size: clamp(3rem, 8vw, 6.5rem);
    font-weight: 300;
    line-height: 1.04;
    letter-spacing: -0.02em;
    color: #161412;
    margin-block-end: 32px;
    word-break: break-word;
  }

  .hero-subline {
    font-size: 1.05rem;
    color: rgba(22,20,18,0.6);
    max-width: 52ch;
    margin-block-end: 40px;
    line-height: 1.65;
  }

  .hero-cta {
    display: inline-block;
    padding: 11px 0;
    color: #2437D6;
    text-decoration: none;
    font-size: 0.9rem;
    border-block-end: 1.5px solid #2437D6;
    transition: opacity 0.15s;
  }
  .hero-cta:hover { opacity: 0.65; }

  .hero-avatar {
    /* 4:5 ratio */
    width: 160px;
    aspect-ratio: 4/5;
    object-fit: cover;
    float: inline-end;
    margin-inline-start: 48px;
    margin-block-end: 24px;
  }

  /* ── Sections ────────────────────────────────────────────────────────── */
  .site-section {
    margin-block-end: 96px;
    counter-increment: section;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 20px;
    margin-block-end: 48px;
    padding-block-end: 16px;
    border-block-end: 1px solid rgba(22,20,18,0.1);
  }

  .section-num {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 4rem;
    font-weight: 300;
    color: rgba(22,20,18,0.08);
    line-height: 1;
    flex-shrink: 0;
    user-select: none;
  }

  .section-heading {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: #161412;
  }

  /* ── About ───────────────────────────────────────────────────────────── */
  .about-body {
    font-size: 1.05rem;
    line-height: 1.8;
    max-width: 66ch;
    color: rgba(22,20,18,0.8);
  }

  .about-facts {
    margin-block-start: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0;
    border-block-start: 1px solid rgba(22,20,18,0.1);
  }
  .fact-item {
    padding: 20px 0;
    border-block-end: 1px solid rgba(22,20,18,0.1);
    padding-inline-end: 24px;
  }
  .fact-label {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(22,20,18,0.35);
    display: block;
    margin-block-end: 4px;
  }
  .fact-value { font-family: 'Newsreader', serif; font-size: 1.05rem; }

  /* ── Projects ────────────────────────────────────────────────────────── */
  .projects-list { list-style: none; padding: 0; }

  .proj-card {
    padding-block: 32px;
    border-block-end: 1px solid rgba(22,20,18,0.1);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: start;
  }

  .proj-name {
    font-family: 'Newsreader', serif;
    font-size: 1.4rem;
    font-weight: 400;
    margin-block-end: 8px;
  }
  .proj-name a { color: #161412; text-decoration: none; }
  .proj-name a:hover { color: #2437D6; }

  .proj-desc { color: rgba(22,20,18,0.6); font-size: 0.95rem; line-height: 1.65; margin-block-end: 12px; }

  .proj-topics {
    display: flex; flex-wrap: wrap; gap: 8px;
    list-style: none; padding: 0;
  }
  .proj-topic {
    font-size: 0.68rem;
    padding: 3px 10px;
    border: 1px solid rgba(22,20,18,0.15);
    color: rgba(22,20,18,0.5);
    font-style: italic;
  }

  .proj-stars {
    font-family: 'Source Serif 4', serif;
    font-size: 0.85rem;
    color: rgba(22,20,18,0.35);
    white-space: nowrap;
  }

  .proj-links { display: flex; gap: 16px; margin-block-start: 12px; }
  .proj-link {
    font-size: 0.82rem;
    color: #2437D6;
    text-decoration: none;
    border-block-end: 1px solid transparent;
  }
  .proj-link:hover { border-block-end-color: #2437D6; }

  /* ── Skills ──────────────────────────────────────────────────────────── */
  .skill-group { margin-block-end: 32px; }
  .skill-group-label {
    font-family: 'Newsreader', serif;
    font-size: 1rem;
    font-style: italic;
    color: rgba(22,20,18,0.45);
    margin-block-end: 12px;
  }
  .skill-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; }
  .skill-item {
    font-size: 0.9rem;
    padding: 6px 16px;
    border: 1px solid rgba(22,20,18,0.15);
    color: rgba(22,20,18,0.75);
  }

  /* ── Timeline ────────────────────────────────────────────────────────── */
  .timeline { list-style: none; padding: 0; }
  .timeline-entry {
    padding-block: 28px;
    border-block-end: 1px solid rgba(22,20,18,0.08);
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .entry-period {
    font-style: italic;
    color: rgba(22,20,18,0.35);
    font-size: 0.85rem;
    padding-block-start: 4px;
  }
  .entry-role {
    font-family: 'Newsreader', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: #161412;
  }
  .entry-org { color: #2437D6; font-size: 0.88rem; margin-block-end: 8px; }
  .entry-desc { color: rgba(22,20,18,0.6); font-size: 0.92rem; line-height: 1.7; margin-block-start: 8px; }

  /* ── Contact ─────────────────────────────────────────────────────────── */
  .contact-note {
    font-family: 'Newsreader', serif;
    font-size: 1.15rem;
    font-style: italic;
    color: rgba(22,20,18,0.6);
    max-width: 52ch;
    margin-block-end: 32px;
    line-height: 1.65;
  }
  .contact-links { list-style: none; padding: 0; }
  .contact-link-item {
    padding-block: 14px;
    border-block-end: 1px solid rgba(22,20,18,0.08);
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  .contact-platform {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(22,20,18,0.3);
    width: 80px;
    flex-shrink: 0;
  }
  .contact-link-item a { color: #2437D6; text-decoration: none; }
  .contact-link-item a:hover { text-decoration: underline; }

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .site-footer {
    padding-block: 32px 64px;
    font-size: 0.78rem;
    font-style: italic;
    color: rgba(22,20,18,0.25);
  }

  /* Clearfix for floated avatar */
  .block-hero::after { content: ''; display: table; clear: both; }
`;
