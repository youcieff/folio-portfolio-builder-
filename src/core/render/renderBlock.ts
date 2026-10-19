import type { Block, TemplateId } from "../schema";
import { assertNever }               from "../schema";
import { escapeHtml, escapeAttr, hrefAttr } from "./escape";

function cssPosition(position: string | undefined): string {
  return (position ?? "center").replace(/-/g, " ");
}

// Each block renderer receives the block data and the active template ID so it
// can conditionally change markup (e.g. Terminal's typewriter heading, ls -la
// projects table vs card grid).

// ─── Hero ──────────────────────────────────────────────────────────────────────

function renderHero(
  b: Extract<Block, { type: "hero" }>,
  tpl: TemplateId,
): string {
  const heading = escapeHtml(b.heading);
  const subline  = escapeHtml(b.subline);
  const ctaLabel = escapeHtml(b.ctaLabel);
  const ctaHref  = hrefAttr(b.ctaHref);
  const layout = b.layout ?? "split";
  const shape = b.avatarShape ?? "rounded";
  const avatarPosition = cssPosition(b.avatarPosition);
  const backgroundPosition = b.backgroundPosition ?? "center";
  const eyebrow = escapeHtml(b.eyebrow || "");
  const avatar = b.avatarSrc
    ? `<img class="hero-avatar hero-avatar-${shape}" style="object-position:${avatarPosition}" src="${escapeAttr(b.avatarSrc)}" alt="${escapeAttr(b.avatarAlt)}" width="480" height="600">`
    : "";
  const background = b.backgroundSrc
    ? `<img class="hero-background hero-bg-pos-${backgroundPosition}" src="${escapeAttr(b.backgroundSrc)}" alt="" aria-hidden="true">`
    : "";

  return `
<header class="block-hero hero-layout-${layout}${b.backgroundSrc ? " hero-has-background" : ""}" role="banner">
  ${background}
  <div class="site-wrap">
    ${avatar}
    <div class="hero-text hero-copy">
      ${eyebrow ? `<span class="hero-eyebrow ${tpl === "brutalist" ? "hero-label" : ""}">${eyebrow}</span>` : ""}
      <h1 class="hero-heading${b.typewriter ? " hero-heading-typewriter" : ""}"${b.typewriter ? ` style="--typewriter-steps:${Math.max(1, [...b.heading].length)}"` : ""}>${heading}</h1>
      ${subline ? `<p class="hero-subline">${subline}</p>` : ""}
      ${ctaLabel && ctaHref ? `<a class="hero-cta"${ctaHref}>${ctaLabel}</a>` : ""}
    </div>
  </div>
</header>`.trim();
}

// ─── About ─────────────────────────────────────────────────────────────────────

function renderAbout(
  b: Extract<Block, { type: "about" }>,
  _tpl: TemplateId,
): string {
  const body = escapeHtml(b.body);
  const heading = escapeHtml(b.heading ?? "About");
  const image = b.image ? `<img class="about-image" style="object-position:${cssPosition(b.imagePosition)}" src="${escapeAttr(b.image)}" alt="${escapeAttr(b.imageAlt || "")}" loading="lazy">` : "";

  const factsHtml = b.facts.length
    ? `<dl class="about-facts">
        ${b.facts
          .map(
            (f) =>
              `<div class="fact-item">
                <dt class="fact-label">${escapeHtml(f.label)}</dt>
                <dd class="fact-value">${escapeHtml(f.value)}</dd>
              </div>`,
          )
          .join("\n")}
      </dl>`
    : "";

  return `
<section id="about" class="site-section block-about${b.image ? " about-with-image" : ""}" aria-label="${heading}">
  <div class="site-wrap">
    ${image}
    <div class="about-copy">
      <h2 class="section-heading">${heading}</h2>
      ${body ? `<p class="about-body">${body}</p>` : ""}
      ${factsHtml}
    </div>
  </div>
</section>`.trim();
}

// ─── Projects ──────────────────────────────────────────────────────────────────

function renderProjects(
  b: Extract<Block, { type: "projects" }>,
  tpl: TemplateId,
  lang: "en" | "ar",
): string {
  const labels = lang === "ar"
    ? { name: "الاسم", description: "الوصف", stars: "التقييم", language: "التقنية", topics: "الموضوعات", repository: "المستودع", live: "الموقع", repo: "المصدر", liveShort: "عرض" }
    : { name: "name", description: "description", stars: "stars", language: "lang", topics: "Topics", repository: "Repository", live: "Live site", repo: "Repo", liveShort: "Live" };
  const heading = escapeHtml(b.heading);
  const layout = b.layout ?? "grid";
  const projects = b.projects.filter((project) =>
    !/^project\s*0?\d+$/i.test(project.name.trim()) || project.description.trim() || project.topics.length || project.image || project.repoUrl || project.liveUrl
  );

  if (projects.length === 0) {
    return `
<section id="projects" class="site-section block-projects" aria-label="${heading}">
  <div class="site-wrap">
    <h2 class="section-heading">${heading}</h2>
  </div>
</section>`.trim();
  }

  // Terminal gets an ls -la table layout
  if (tpl === "terminal" && layout === "list") {
    const rows = projects
      .map((p) => {
        const name = p.repoUrl
          ? `<a${hrefAttr(p.repoUrl)}>${escapeHtml(p.name)}</a>`
          : escapeHtml(p.name);
        const stars = p.stars !== undefined ? `★ ${p.stars}` : "";
        const lang  = p.language ?? "";
        return `
<tr>
  <td class="proj-name">${p.image ? `<img class="proj-image proj-image-thumb" style="object-position:${cssPosition(p.imagePosition)}" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.imageAlt || p.name)}" loading="lazy">` : ""}${name}</td>
  <td class="proj-desc">${escapeHtml(p.description)}</td>
  <td class="proj-stars">${escapeHtml(stars)}</td>
  <td class="proj-lang">${escapeHtml(lang)}</td>
</tr>`.trim();
      })
      .join("\n");

    return `
<section id="projects" class="site-section block-projects" aria-label="${heading}">
  <div class="site-wrap">
    <h2 class="section-heading">${heading}</h2>
    <table class="projects-table">
      <thead>
        <tr>
          <th scope="col">${labels.name}</th>
          <th scope="col">${labels.description}</th>
          <th scope="col">${labels.stars}</th>
          <th scope="col">${labels.language}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</section>`.trim();
  }

  // Editorial: list layout
  if (layout === "list") {
    const items = projects
      .map((p) => {
        const topics = p.topics.length
          ? `<ul class="proj-topics" aria-label="${labels.topics}">${p.topics.map((t) => `<li class="proj-topic">${escapeHtml(t)}</li>`).join("")}</ul>`
          : "";
        const stars = p.stars !== undefined ? `<span class="proj-stars">★ ${p.stars}</span>` : "";
        const nameEl = p.repoUrl
          ? `<a${hrefAttr(p.repoUrl)}>${escapeHtml(p.name)}</a>`
          : escapeHtml(p.name);
        const links = [
          p.repoUrl ? `<a class="proj-link"${hrefAttr(p.repoUrl)}>${labels.repository}</a>` : "",
          p.liveUrl ? `<a class="proj-link"${hrefAttr(p.liveUrl)}>${labels.live}</a>` : "",
        ]
          .filter(Boolean)
          .join("");

        return `
<li>
  <article class="proj-card">
    ${p.image ? `<img class="proj-image" style="object-position:${cssPosition(p.imagePosition)}" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.imageAlt || p.name)}" loading="lazy">` : ""}
    <div>
      <h3 class="proj-name">${nameEl}</h3>
      <p class="proj-desc">${escapeHtml(p.description)}</p>
      ${topics}
      ${links ? `<div class="proj-links">${links}</div>` : ""}
    </div>
    ${stars}
  </article>
</li>`.trim();
      })
      .join("\n");

    return `
<section id="projects" class="site-section block-projects projects-layout-list" aria-label="${heading}">
  <div class="site-wrap">
    <div class="section-header">
      <span class="section-num" aria-hidden="true">03</span>
      <h2 class="section-heading">${heading}</h2>
    </div>
    <ul class="projects-list">${items}</ul>
  </div>
</section>`.trim();
  }

  // Card grid (midnight-glass + brutalist)
  const cards = projects
    .map((p) => {
      const topics = p.topics.length
        ? `<ul class="proj-topics" aria-label="${labels.topics}">${p.topics.map((t) => `<li class="proj-topic">${escapeHtml(t)}</li>`).join("")}</ul>`
        : "";
      const meta = [
        p.stars !== undefined ? `★ ${p.stars}` : "",
        p.language ?? "",
      ]
        .filter(Boolean)
        .join("  ·  ");
      const nameEl = p.repoUrl
        ? `<a${hrefAttr(p.repoUrl)}>${escapeHtml(p.name)}</a>`
        : escapeHtml(p.name);
      const links = [
        p.repoUrl ? `<a class="proj-link"${hrefAttr(p.repoUrl)}>${labels.repo}</a>` : "",
        p.liveUrl ? `<a class="proj-link"${hrefAttr(p.liveUrl)}>${labels.liveShort}</a>` : "",
      ]
        .filter(Boolean)
        .join("");

      return `
<article class="proj-card glass-card">
  ${p.image ? `<img class="proj-image" style="object-position:${cssPosition(p.imagePosition)}" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.imageAlt || p.name)}" loading="lazy">` : ""}
  <h3 class="proj-name">${nameEl}</h3>
  <p class="proj-desc">${escapeHtml(p.description)}</p>
  ${meta ? `<p class="proj-meta">${escapeHtml(meta)}</p>` : ""}
  ${topics}
  ${links ? `<div class="proj-links">${links}</div>` : ""}
</article>`.trim();
    })
    .join("\n");

  return `
<section id="projects" class="site-section block-projects" aria-label="${heading}">
  <div class="site-wrap">
    <h2 class="section-heading">${heading}</h2>
    <div class="projects-grid projects-layout-${layout === "feature" ? "feature" : "grid"}">${cards}</div>
  </div>
</section>`.trim();
}

// ─── Skills ────────────────────────────────────────────────────────────────────

function renderSkills(
  b: Extract<Block, { type: "skills" }>,
  _tpl: TemplateId,
): string {
  const heading = escapeHtml(b.heading);

  const groups = b.groups
    .map((g) => {
      const items = g.skills
        .map((s) => `<li class="skill-item">${escapeHtml(s)}</li>`)
        .join("");
      return `
<div class="skill-group">
  <p class="skill-group-label">${escapeHtml(g.label)}</p>
  <ul class="skill-list">${items}</ul>
</div>`.trim();
    })
    .join("\n");

  return `
<section id="skills" class="site-section block-skills" aria-label="${heading}">
  <div class="site-wrap">
    <h2 class="section-heading">${heading}</h2>
    ${groups}
  </div>
</section>`.trim();
}

// ─── Timeline ──────────────────────────────────────────────────────────────────

function renderTimeline(
  b: Extract<Block, { type: "timeline" }>,
  tpl: TemplateId,
): string {
  const heading = escapeHtml(b.heading);

  const entries = b.entries
    .map(
      (e) => `
<li class="timeline-entry">
  <time class="entry-period">${escapeHtml(e.period)}</time>
  <div class="entry-body">
    <p class="entry-role">${escapeHtml(e.role)}</p>
    <p class="entry-org">${escapeHtml(e.org)}</p>
    ${e.description ? `<p class="entry-desc">${escapeHtml(e.description)}</p>` : ""}
  </div>
</li>`.trim(),
    )
    .join("\n");

  // Editorial uses numbered sections
  const sectionHeader =
    tpl === "editorial"
      ? `<div class="section-header"><span class="section-num" aria-hidden="true">04</span><h2 class="section-heading">${heading}</h2></div>`
      : `<h2 class="section-heading">${heading}</h2>`;

  return `
<section id="experience" class="site-section block-timeline" aria-label="${heading}">
  <div class="site-wrap">
    ${sectionHeader}
    <ol class="timeline">${entries}</ol>
  </div>
</section>`.trim();
}

// ─── Contact ───────────────────────────────────────────────────────────────────

function renderContact(
  b: Extract<Block, { type: "contact" }>,
  _tpl: TemplateId,
): string {
  const heading = escapeHtml(b.heading);
  const note    = escapeHtml(b.note);

  const links = b.links
    .map((l) => {
      // email addresses need mailto: prefix if not already there
      let href = l.href;
      if (href && !/^(https?:|mailto:|tel:)/i.test(href)) {
        href = l.platform.toLowerCase() === "phone" ? `tel:${href}` : l.platform.toLowerCase() === "email" ? `mailto:${href}` : href;
      }
      return `
<li class="contact-link-item">
  <a class="contact-social-link"${hrefAttr(href)} target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(l.label || l.platform)}">${contactIcon(l.platform)}<span>${escapeHtml(l.label || l.platform)}</span></a>
</li>`.trim();
    })
    .join("\n");

  return `
<section id="contact" class="site-section block-contact" aria-label="${heading}">
  <div class="site-wrap">
    <h2 class="section-heading">${heading}</h2>
    ${note ? `<p class="contact-note">${note}</p>` : ""}
    ${links ? `<ul class="contact-links">${links}</ul>` : ""}
  </div>
</section>`.trim();
}

// ─── Dispatcher ────────────────────────────────────────────────────────────────

export function renderBlock(block: Block, tpl: TemplateId, lang: "en" | "ar" = "en"): string {
  switch (block.type) {
    case "hero":     return renderHero(block, tpl);
    case "about":    return renderAbout(block, tpl);
    case "projects": return renderProjects(block, tpl, lang);
    case "skills":   return renderSkills(block, tpl);
    case "timeline": return renderTimeline(block, tpl);
    case "contact":  return renderContact(block, tpl);
    default:         return assertNever(block);
  }
}

function contactIcon(platform: string): string {
  const key = platform.toLowerCase().replace(/[^a-z]/g, "");
  const icons: Record<string, string> = {
    linkedin: '<path d="M3 6h2v8H3zm1-3a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 4 3Zm3 3h2v1.1A2.8 2.8 0 0 1 11.5 6C14 6 14 8 14 10v4h-2v-3.5c0-1.1 0-2.5-1.5-2.5S9 9.2 9 10.4V14H7z"/>',
    github: '<path d="M8 .8a7.2 7.2 0 0 0-2.3 14c.4.1.5-.2.5-.4v-1.4c-2 .4-2.5-.8-2.5-.8-.3-.8-.8-1-.8-1-.7-.5.1-.5.1-.5.7 0 1.1.7 1.1.7.6 1 1.5.7 2 .5.1-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.4.7-1.9-.1-.2-.3-1 .1-1.9 0 0 .6-.2 2 .7a6.8 6.8 0 0 1 3.7 0c1.4-1 2-.7 2-.7.4.9.2 1.7.1 1.9.5.5.7 1.1.7 1.9 0 2.8-1.7 3.4-3.3 3.6.3.2.5.6.5 1.2v1.8c0 .2.1.5.5.4A7.2 7.2 0 0 0 8 .8Z"/>',
    instagram: '<rect x="2" y="2" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="4.3" r=".9"/>',
    behance: '<path d="M2 3h5c2 0 3 .9 3 2.5 0 1-.5 1.7-1.4 2.1C9.8 8 11 8.7 11 10.3 11 12.6 9.4 14 6.8 14H2zm2 2v2h2.6c.8 0 1.3-.3 1.3-1s-.5-1-1.3-1zm0 4v3h2.7c1 0 1.5-.5 1.5-1.5S7.7 9 6.7 9zM12 5h3v1.3h-3zm1.5 2c2 0 3 1.3 3 3.5h-4c.1.8.5 1.2 1.2 1.2.5 0 .8-.2 1-.6h1.7c-.3 1.3-1.3 2-2.8 2-1.9 0-3.1-1.2-3.1-3.1S11.7 7 13.5 7Zm1.2 2.4c-.1-.7-.5-1-1.2-1s-1.1.3-1.2 1z"/>',
    x: '<path d="M2 2h3.4l3.5 4.7L13 2h2l-5.2 6 5.8 8h-3.4l-4-5.3L3.5 16h-2l5.6-6.5zm2.4 1.5 7.6 11h1.4l-7.6-11z"/>',
    email: '<rect x="1.5" y="3" width="13" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m2.5 4 5.5 4.5L13.5 4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    website: '<circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M1.8 8h12.4M8 1.5a10 10 0 0 1 0 13M8 1.5a10 10 0 0 0 0 13" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    dribbble: '<circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 3.5c3.5 2 6.3 5.3 7.6 10M2 8c4.2.1 8.2-1.4 10.6-4M5 14c1.5-3.5 5-5 9-4.1" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    youtube: '<path d="M15 5.2a2 2 0 0 0-1.4-1.4C12.4 3.5 8 3.5 8 3.5s-4.4 0-5.6.3A2 2 0 0 0 1 5.2C.7 6.4.7 8 .7 8s0 1.6.3 2.8a2 2 0 0 0 1.4 1.4c1.2.3 5.6.3 5.6.3s4.4 0 5.6-.3a2 2 0 0 0 1.4-1.4c.3-1.2.3-2.8.3-2.8s0-1.6-.3-2.8ZM6.5 10.2V5.8L10.3 8z"/>',
    facebook: '<path d="M9.2 15V8.7h2.1l.3-2.5H9.2V4.6c0-.7.2-1.2 1.2-1.2h1.3V1.2c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7v1.4H4v2.5h2.1V15z"/>',
    tiktok: '<path d="M10 1h2.4c.2 1.6 1 2.7 2.6 3.4v2.4a7.1 7.1 0 0 1-2.6-.9v5.2a4.6 4.6 0 1 1-4.6-4.6c.4 0 .8 0 1.2.1v2.5a2.2 2.2 0 1 0 1 1.9z"/>',
    whatsapp: '<path d="M13.5 11.7a6.4 6.4 0 0 0-9.9-7.6 6.3 6.3 0 0 0-.8 7.7L2 15l3.2-.8a6.3 6.3 0 0 0 8.3-2.5ZM8 13.4a5.3 5.3 0 0 1-2.6-.7l-.2-.1-1.9.5.5-1.8-.1-.2a5.3 5.3 0 1 1 4.3 2.3Zm2.9-3.9c-.2-.1-1-.5-1.2-.5-.1-.1-.3-.1-.4.1l-.5.6c-.1.1-.2.1-.4 0-.2-.1-.7-.3-1.3-.8-.5-.4-.8-.9-.9-1-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3l-.5-1.2c-.1-.3-.3-.3-.4-.3h-.4c-.1 0-.3.1-.5.2-.2.2-.6.6-.6 1.4s.6 1.6.7 1.7c.1.1 1.2 1.9 3 2.6.4.2.7.3 1 .3.4.1.7.1 1 0 .3-.1 1-.4 1.1-.8.2-.4.2-.7.1-.8 0-.1-.1-.2-.3-.3Z"/>',
    telegram: '<path d="m1.5 7.4 12-4.6c.6-.2 1.1.1.9.9l-2 9.6c-.1.7-.6.9-1.2.5l-3.1-2.3-1.5 1.5c-.2.2-.4.4-.8.4l.2-3.2 5.9-5.3c.3-.3-.1-.4-.5-.2L4.1 9.3 1 8.3c-.7-.2-.7-.7.5-.9Z"/>',
    pinterest: '<path d="M8 1a7 7 0 0 0-2.5 13.5c0-.6 0-1.3.2-1.9l.9-3.8s-.2-.4-.2-1c0-.9.5-1.6 1.2-1.6.5 0 .8.4.8 1s-.4 1.5-.6 2.4c-.2.7.4 1.2 1.1 1.2 1.3 0 2.2-1.7 2.2-3.7 0-1.5-1-2.7-2.9-2.7-2.1 0-3.4 1.6-3.4 3.3 0 .6.2 1.1.5 1.4.2.2.2.3.1.5l-.2.6c-.1.2-.2.3-.4.2-1-.4-1.5-1.5-1.5-2.7 0-2 1.7-4.5 5.1-4.5 2.7 0 4.5 2 4.5 4.2 0 2.9-1.6 5-4 5-.8 0-1.5-.5-1.7-1l-.5 2a7 7 0 0 1-1.2 2A7 7 0 1 0 8 1Z"/>',
  };
  const keyMap: Record<string, string> = { mail: "email", gmail: "email", portfolio: "website", url: "website", personalwebsite: "website", twitter: "x", xcom: "x", artstation: "behance", medium: "website", phone: "website", other: "website" };
  return `<svg class="social-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">${icons[keyMap[key] ?? key] ?? icons.website}</svg>`;
}
