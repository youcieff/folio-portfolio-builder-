import type { SiteSchema } from "../schema";
import { renderBlock }       from "./renderBlock";
import { renderTheme }       from "./renderTheme";
import { getTemplateCss }    from "./templates";
import { escapeHtml, escapeAttr } from "./escape";

export interface RenderOptions {
  /**
   * Include a Google Fonts <link> in the exported HTML.
   * Default: true. Set to false for fully self-contained output.
   */
  includeGoogleFonts?: boolean;
}

/**
 * The single pure renderer.
 *
 * Given the same schema, it ALWAYS returns a byte-identical HTML string.
 * No Date.now(), no Math.random(), no external state.
 *
 * Both the live preview (iframe srcdoc) and the Export button use this function,
 * so "what you see is exactly what you export."
 */
export function renderSite(
  schema: SiteSchema,
  opts: RenderOptions = {},
): string {
  const includeGoogleFonts = opts.includeGoogleFonts ?? true;
  const tpl = schema.theme.templateId;
  const lang = schema.lang;
  const dir  = lang === "ar" ? "rtl" : "ltr";

  // Template-level CSS (<style> tag with @import if fonts enabled)
  const arabicFonts = lang === "ar" && includeGoogleFonts
    ? "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');"
    : "";
  const templateStyle = `<style>${arabicFonts}${getTemplateCss(tpl)}
  html[lang="ar"] body { font-family: 'IBM Plex Sans Arabic', Tahoma, sans-serif; line-height: 1.8; }
  html[lang="ar"] :is(h1, h2, h3, h4, .hero-heading, .section-heading) { font-family: 'Noto Naskh Arabic', 'IBM Plex Sans Arabic', Tahoma, serif; letter-spacing: 0; line-height: 1.4; }
  /* Preserve line breaks for text fields */
  .about-body, .entry-desc, .contact-note {
    white-space: pre-wrap;
  }
  :root { scroll-behavior: smooth; scroll-padding-top: 88px; }
  .folio-nav { position: relative; z-index: 50; width: 100%; background: color-mix(in srgb, var(--bg) 76%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--ink) 7%, transparent); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); }
  .folio-nav-sticky { position: sticky; top: 0; }
  .folio-nav-inner { position: relative; max-width: 1280px; min-height: 88px; margin: auto; padding: 12px clamp(24px, 7vw, 112px); display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .folio-brand { position: relative; z-index: 1; color: var(--ink); text-decoration: none; font: 800 clamp(1.1rem, 2.5vw, 1.55rem)/1.2 var(--font-head); letter-spacing: -.06em; }
  .folio-nav-links { display: flex; align-items: center; gap: clamp(14px, 2.6vw, 34px); }
  .folio-nav-links a { color: var(--ink-soft); text-decoration: none; font: 600 .88rem/1.3 var(--font-body); transition: color .24s, background .24s, transform .24s, box-shadow .24s; }
  .folio-nav-links a:hover, .folio-nav-links a:focus-visible, .folio-nav-links a[aria-current=location] { color: var(--ink); }
  .folio-nav-glass { background: transparent; border-color: transparent; box-shadow: none; }
  .folio-nav-glass .folio-nav-links { position: absolute; left: 50%; transform: translateX(-50%); gap: 4px; padding: 6px; border: 1px solid color-mix(in srgb, var(--ink) 11%, transparent); border-radius: 999px; background: color-mix(in srgb, var(--surface) 62%, var(--bg) 38%); box-shadow: 0 12px 40px color-mix(in srgb, var(--ink) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 8%, transparent); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
  .folio-nav-glass .folio-nav-links a, .folio-nav-pill .folio-nav-links a { padding: 10px clamp(13px, 1.8vw, 22px); border: 1px solid transparent; border-radius: 999px; white-space: nowrap; }
  .folio-nav-glass .folio-nav-links a:hover, .folio-nav-glass .folio-nav-links a:focus-visible, .folio-nav-glass .folio-nav-links a[aria-current=location], .folio-nav-pill .folio-nav-links a:hover, .folio-nav-pill .folio-nav-links a[aria-current=location] { color: var(--ink); border-color: color-mix(in srgb, var(--accent) 52%, transparent); background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 25%, var(--surface)), color-mix(in srgb, var(--accent) 10%, var(--surface))); box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 18%, transparent), inset 0 1px 0 color-mix(in srgb, white 16%, transparent); transform: translateY(-1px); }
  .folio-nav-minimal .folio-nav-links a:hover { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 6px; }
  .folio-menu-toggle { display: none; }
  .contact-links { display: flex; flex-wrap: wrap; gap: 12px; }
  .contact-link-item { list-style: none; }
  .contact-social-link { display: inline-flex; align-items: center; gap: 9px; padding: 11px 15px; border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent); border-radius: max(8px, var(--radius)); color: var(--ink); text-decoration: none; transition: transform .22s, border-color .22s, color .22s, box-shadow .22s; }
  .contact-social-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 12%, transparent); }
  .social-icon { flex: 0 0 auto; fill: currentColor; }
  .folio-progress { position: fixed; z-index: 1001; inset: 0 0 auto; height: 3px; pointer-events: none; background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .folio-progress span { display: block; width: 100%; height: 100%; transform: scaleX(0); transform-origin: left center; background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 38%, #70d7ed)); box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 52%, transparent); }
  [dir=rtl] .folio-progress span { transform-origin: right center; }
  .folio-top-button { position: fixed; z-index: 70; inset-inline-end: 24px; bottom: 24px; display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent); border-radius: 16px; color: var(--bg); background: color-mix(in srgb, var(--ink) 90%, var(--accent)); box-shadow: 0 12px 32px color-mix(in srgb, var(--ink) 24%, transparent); opacity: 0; visibility: hidden; transform: translateY(10px); transition: opacity .22s, visibility .22s, transform .22s, background .22s; cursor: pointer; }
  .folio-top-button.is-visible { opacity: 1; visibility: visible; transform: translateY(0); }
  .folio-top-button:hover { background: var(--accent); }
  .folio-lightbox { position: fixed; width: min(94vw, 1240px); max-width: none; max-height: 92dvh; padding: 14px; border: 1px solid color-mix(in srgb, white 22%, transparent); border-radius: 22px; color: var(--ink); background: color-mix(in srgb, var(--bg) 92%, var(--surface)); box-shadow: 0 30px 110px #0009; overflow: visible; }
  .folio-lightbox::backdrop { background: #080711d9; backdrop-filter: blur(12px); }
  .folio-lightbox img { display: block; width: 100%; max-height: calc(92dvh - 28px); object-fit: contain; border-radius: 12px; }
  .folio-lightbox-close { position: absolute; z-index: 1; inset-block-start: -13px; inset-inline-end: -13px; display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid #ffffff55; border-radius: 50%; color: white; background: #211d32; font-size: 24px; cursor: pointer; }
  .interactive-images .proj-image, .interactive-images .about-image, .interactive-images .hero-avatar { cursor: zoom-in; }
  .site-footer { padding-block: 34px; border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent); color: var(--ink-soft); font-size: .78rem; }
  .folio-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
  .folio-reveal.is-visible { opacity: 1; transform: translateY(0); }
  .motion-expressive .proj-card:nth-child(3n + 2) { transition-delay: .08s; }
  .motion-expressive .proj-card:nth-child(3n) { transition-delay: .16s; }
  .theme-midnight-glass .folio-nav { box-shadow: 0 12px 36px color-mix(in srgb, var(--ink) 5%, transparent); }
  .theme-editorial .folio-nav-inner { min-height: 76px; }
  .theme-brutalist .folio-nav { border-bottom: 2px solid var(--ink); backdrop-filter: none; }
  .theme-terminal .folio-nav-links a { font-family: var(--font-mono, var(--font-body)); }
  @media (max-width: 760px) { .folio-nav-inner { min-height: 68px; gap: 12px; flex-wrap: wrap; } .folio-menu-toggle { display: flex; width: 42px; height: 42px; margin-inline-start: auto; border: 1px solid color-mix(in srgb, var(--ink) 15%, transparent); border-radius: 14px; background: color-mix(in srgb, var(--surface) 78%, transparent); flex-direction: column; align-items: center; justify-content: center; gap: 5px; } .folio-menu-toggle span { width: 16px; height: 1.5px; background: var(--ink); transition: transform .2s; } .folio-menu-toggle[aria-expanded=true] span:first-child { transform: translateY(3.25px) rotate(45deg); } .folio-menu-toggle[aria-expanded=true] span:last-child { transform: translateY(-3.25px) rotate(-45deg); } .folio-nav-glass .folio-nav-links, .folio-nav-links { position: static; left: auto; transform: none; display: none; order: 3; width: 100%; align-items: stretch; flex-direction: column; gap: 3px; padding: 8px; border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent); border-radius: 18px; background: color-mix(in srgb, var(--surface) 94%, var(--bg)); box-shadow: 0 18px 44px color-mix(in srgb, var(--ink) 14%, transparent); } .folio-nav-links.is-open { display: flex; animation: folio-menu-in .2s ease both; } .folio-nav-glass .folio-nav-links a, .folio-nav-links a, .folio-nav-pill .folio-nav-links a { padding: 12px 14px; border-radius: 12px; } }
  @keyframes folio-menu-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { :root { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } .folio-reveal { opacity: 1; transform: none; } }
  .motion-none *, .motion-none *::before, .motion-none *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
</style>`;

  // Theme token overrides (OKLCH custom properties)
  const themeStyle = renderTheme(schema.theme, { includeGoogleFonts });

  // Render each block in order — deterministic because arrays are ordered
  const heroBlocks = schema.blocks.filter((block) => block.type === "hero");
  const meaningfulHero = heroBlocks.find((block) => block.type === "hero" && (
    (block.heading.trim() && block.heading.trim().toLowerCase() !== "your name" && !(lang === "ar" && block.heading.trim() === "اسمك")) ||
    block.subline.trim() || block.eyebrow.trim() || block.ctaLabel.trim() || block.avatarSrc || block.backgroundSrc
  ));
  const visibleHeroId = meaningfulHero?.id ?? heroBlocks[0]?.id;

  const visibleBlocks = schema.blocks.filter((block) => {
    if (block.type === "hero") {
      const untouchedName = block.heading.trim().toLowerCase() === "your name" || (lang === "ar" && block.heading.trim() === "اسمك");
      const hasOtherIntro = Boolean(block.subline.trim() || block.eyebrow.trim() || block.ctaLabel.trim() || block.avatarSrc || block.backgroundSrc);
      return block.id === visibleHeroId && (!untouchedName || hasOtherIntro);
    }
    if (block.type === "about") return Boolean(block.body.trim() || block.image || block.facts.length);
    if (block.type === "projects") return block.projects.some((project) =>
      !/^project\s*0?\d+$/i.test(project.name.trim()) || project.description.trim() || project.topics.length || project.image || project.repoUrl || project.liveUrl
    );
    if (block.type === "skills") return block.groups.some((group) => group.skills.length > 0);
    if (block.type === "timeline") return block.entries.length > 0;
    if (block.type === "contact") return Boolean(block.note.trim() || block.links.length);
    return true;
  });
  const blocksHtml = visibleBlocks
    .map((block) => renderBlock(block, tpl, lang))
    .join("\n\n");

  const sectionIds: Partial<Record<SiteSchema["blocks"][number]["type"], string>> = {
    about: "about", projects: "projects", skills: "skills", timeline: "experience", contact: "contact",
  };
  const navSeen = new Set<string>();
  const navigationSettings = schema.experience.navigationItems;
  const navItems = visibleBlocks.flatMap((block) => {
    const id = sectionIds[block.type];
    if (!id || navSeen.has(id)) return [];
    navSeen.add(id);
    const setting = navigationSettings.find((item) => item.section === id);
    if (setting?.enabled === false) return [];
    return [{ id, label: setting?.label.trim() || block.heading }];
  });
  const hero = visibleBlocks.find((block) => block.type === "hero");
  const brand = hero?.type === "hero" ? hero.heading : schema.metaTitle !== "My Portfolio" ? schema.metaTitle : "";
  const navigationBrand = schema.experience.navigationShowBrand
    ? schema.experience.navigationBrandLabel.trim() || brand
    : "";
  const navigation = schema.experience.navigation && navItems.length
    ? `<nav class="folio-nav folio-nav-${schema.experience.navigationStyle} folio-nav-layout-${schema.experience.navigationLayout} folio-nav-size-${schema.experience.navigationSize}${schema.experience.stickyNavigation ? " folio-nav-sticky" : ""}" aria-label="${lang === "ar" ? "التنقل الرئيسي" : "Main navigation"}"><div class="folio-nav-inner">${navigationBrand ? `<a class="folio-brand" href="#top">${escapeHtml(navigationBrand)}</a>` : ""}<button class="folio-menu-toggle" type="button" aria-expanded="false" aria-controls="folio-nav-links" aria-label="${lang === "ar" ? "فتح القائمة" : "Open menu"}"><span></span><span></span></button><div class="folio-nav-links" id="folio-nav-links">${navItems.map((item, index) => `<a href="#${escapeAttr(item.id)}"${index === 0 ? ` aria-current="location"` : ""}>${escapeHtml(item.label)}</a>`).join("")}</div></div></nav>`
    : "";

  const motionInit = schema.experience.motion === "none" ? "" : `if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
    const sections=[...document.querySelectorAll('.site-section')];
    const revealItems='.section-header,.section-heading,.about-image,.about-body,.fact-item,.proj-card,.skill-group,.timeline-entry,.contact-note,.contact-links';
    sections.forEach(section=>{
      section.classList.add('folio-reveal');
      section.querySelectorAll(revealItems).forEach((item,index)=>item.style.setProperty('--reveal-delay',Math.min(index,7)*75+80+'ms'));
    });
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -7% 0px'});
    sections.forEach(section=>reveal.observe(section));
    if(m){const links=[...m.querySelectorAll('a[href^="#"]')],targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const active=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.removeAttribute('aria-current'));const link=links.find(a=>document.querySelector(a.getAttribute('href'))===entry.target);if(link)link.setAttribute('aria-current','location')}}),{rootMargin:'-25% 0px -65% 0px'});targets.forEach(target=>active.observe(target))}
  }`;
  const navigationInit = `if(m&&'IntersectionObserver'in window){const links=[...m.querySelectorAll('a[href^="#"]')],targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const active=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.removeAttribute('aria-current'));const link=links.find(a=>document.querySelector(a.getAttribute('href'))===e.target);if(link)link.setAttribute('aria-current','location')}}),{rootMargin:'-25% 0px -65% 0px'});targets.forEach(x=>active.observe(x))}`;
  const effectsInit = `const progress=document.querySelector('.folio-progress'),topButton=document.querySelector('.folio-top-button');if(progress){let queued=false;const update=()=>{queued=false;const root=document.documentElement,max=root.scrollHeight-innerHeight,p=max>0?Math.min(1,scrollY/max):0;progress.firstElementChild.style.transform='scaleX('+p+')';progress.setAttribute('aria-valuenow',String(Math.round(p*100)))};addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update()}if(topButton){const toggle=()=>topButton.classList.toggle('is-visible',scrollY>480);addEventListener('scroll',toggle,{passive:true});toggle();topButton.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}))}const lightbox=document.querySelector('.folio-lightbox');if(lightbox){const image=lightbox.querySelector('img');document.addEventListener('click',e=>{const source=e.target.closest('.proj-image,.about-image,.hero-avatar');if(source){image.src=source.currentSrc||source.src;image.alt=source.alt||'';lightbox.showModal()}});lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()})}`;
  const motionScript = `<script>(()=>{const t=document.querySelector('.folio-menu-toggle'),m=document.querySelector('.folio-nav-links');if(t&&m){const close=()=>{m.classList.remove('is-open');t.setAttribute('aria-expanded','false')};t.addEventListener('click',()=>{const open=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!open));m.classList.toggle('is-open',!open)});m.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.addEventListener('click',e=>{if(!e.target.closest('.folio-nav'))close()})}${navigationInit}${motionInit}${effectsInit}})();</script>`;

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeTitle(schema)}</title>
  <meta name="description" content="${escapeMetaDesc(schema)}">
  <meta name="theme-color" content="${escapeAttr(oklchToCss(schema.theme.background))}">
  <meta property="og:title" content="${escapeAttr(escapeTitle(schema))}">
  <meta property="og:description" content="${escapeMetaDesc(schema)}">
  <meta property="og:type" content="website">
  ${templateStyle}
  ${themeStyle}
</head>
<body id="top" class="theme-${tpl} design-${schema.theme.designStyle ?? tpl} divider-${schema.experience.sectionDivider} motion-${schema.experience.motion}${schema.experience.imageLightbox ? " interactive-images" : ""}">
  ${schema.experience.scrollProgress ? `<div class="folio-progress" role="progressbar" aria-label="${lang === "ar" ? "تقدم القراءة" : "Reading progress"}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>` : ""}
  ${navigation}
  ${blocksHtml}
  ${schema.experience.backToTop ? `<button class="folio-top-button" type="button" aria-label="${lang === "ar" ? "العودة إلى الأعلى" : "Back to top"}" title="${lang === "ar" ? "العودة إلى الأعلى" : "Back to top"}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 14 7-7 7 7M12 7v13"/></svg></button>` : ""}
  ${schema.experience.imageLightbox ? `<dialog class="folio-lightbox" aria-label="${lang === "ar" ? "عارض الصور" : "Image viewer"}"><form method="dialog"><button class="folio-lightbox-close" aria-label="${lang === "ar" ? "إغلاق" : "Close image"}">×</button></form><img src="" alt=""></dialog>` : ""}
  ${schema.experience.showFooter && visibleBlocks.some((block) => block.type !== "hero") && (brand || (schema.metaTitle && schema.metaTitle !== "My Portfolio")) ? `<footer class="site-footer" role="contentinfo"><div class="site-wrap">${escapeHtml(brand || schema.metaTitle)}</div></footer>` : ""}
  ${motionScript}
</body>
</html>`;
}

function oklchToCss(color: SiteSchema["theme"]["background"]): string {
  return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Escape for use inside <title> (no attribute context, but still needs &, <, >)
function escapeTitle(schema: SiteSchema): string {
  const hero = schema.blocks.find((b) => b.type === "hero");
  const heroName = hero && hero.type === "hero" ? hero.heading : "";
  const name = schema.metaTitle && schema.metaTitle !== "My Portfolio"
    ? schema.metaTitle
    : heroName || "Portfolio";
  return name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeMetaDesc(schema: SiteSchema): string {
  const about = schema.blocks.find((b) => b.type === "about");
  const aboutText = about && about.type === "about" ? about.body : "";
  const text = (schema.metaDesc || aboutText).slice(0, 155);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
