import { describe, expect, it } from "vitest";
import { PRESET_THEMES } from "@/core/presets";
import { createStarterPortfolio } from "@/core/starterPortfolio";
import { parseSite } from "@/core/schema";
import { renderSite } from "@/core/render/renderSite";
import { themeBackgroundCss } from "@/core/render/renderTheme";
import { BACKGROUND_STYLES } from "@/core/render/renderTheme";

describe("portfolio theme rendering", () => {
  it("creates a real Arabic RTL starter portfolio with localized output labels", () => {
    const blocks = createStarterPortfolio("ar");
    const hero = blocks.find((block) => block.type === "hero");
    const projects = blocks.find((block) => block.type === "projects");
    expect(hero?.type === "hero" && hero.heading).toBe("\u0627\u0633\u0645\u0643");
    if (projects?.type === "projects") projects.projects.push({
      id: "be058a3c-4f4a-4b6b-96ba-58a7b9c2875e", name: "Project", description: "Description", topics: ["Design"],
      image: "", imageAlt: "", imagePosition: "center", repoUrl: "https://example.com/repo", liveUrl: "https://example.com",
    });
    const schema = parseSite({ version: 1, lang: "ar", theme: PRESET_THEMES[0]!.theme, blocks });
    expect(schema).not.toBeNull();
    const html = renderSite(schema!, { includeGoogleFonts: false });
    expect(html).toContain('<html lang="ar" dir="rtl">');
    expect(html).toContain("\u0623\u0639\u0645\u0627\u0644 \u0645\u062e\u062a\u0627\u0631\u0629");
    expect(html).toContain('aria-label="\u0627\u0644\u0645\u0648\u0636\u0648\u0639\u0627\u062a"');
    expect(html).toContain(">\u0627\u0644\u0645\u0635\u062f\u0631</a>");
    expect(html).toContain(">\u0639\u0631\u0636</a>");
  });

  it("supports each background style with the selected palette", () => {
    const colors = { background: "#faf7f1", accent: "#bb603e", surface: "#fffefa" };
    expect(themeBackgroundCss("solid", colors.background, colors.accent, colors.surface)).toBe(colors.background);
    expect(themeBackgroundCss("soft-gradient", colors.background, colors.accent, colors.surface)).toContain("linear-gradient");
    expect(themeBackgroundCss("aurora", colors.background, colors.accent, colors.surface)).toContain("radial-gradient");
    expect(themeBackgroundCss("sunset", colors.background, colors.accent, colors.surface)).toContain("linear-gradient");
  });

  it("provides 20 distinct gradient designs", () => {
    expect(BACKGROUND_STYLES).toHaveLength(20);
    expect(new Set(BACKGROUND_STYLES.map((style) => style.id)).size).toBe(20);
    for (const style of BACKGROUND_STYLES) {
      const css = themeBackgroundCss(style.id, "#faf7f1", "#bb603e", "#fffefa");
      expect(css).toMatch(/gradient/);
      expect(css).not.toContain("undefined");
    }
  });

  it("renders every preset as valid, exportable portfolio data", () => {
    expect(PRESET_THEMES).toHaveLength(40);
    expect(new Set(PRESET_THEMES.map((preset) => preset.theme.designStyle)).size).toBeGreaterThanOrEqual(20);
    for (const preset of PRESET_THEMES) {
      const schema = parseSite({ version: 1, theme: preset.theme, blocks: createStarterPortfolio() });
      expect(schema, `${preset.name} should pass schema validation`).not.toBeNull();
      const html = renderSite(schema!, { includeGoogleFonts: false });
      expect(html).toContain(`class="theme-${preset.theme.templateId}`);
      expect(html).toContain(`design-${preset.theme.designStyle}`);
      expect(html).toContain("background:");
      expect(html).toContain("folio-nav");
    }
  });

  it("keeps older backups compatible and supplies the gradient default", () => {
    const oldTheme = { ...PRESET_THEMES[0]!.theme } as Record<string, unknown>;
    delete oldTheme.backgroundStyle;
    const schema = parseSite({ version: 1, theme: oldTheme, blocks: [] });
    expect(schema?.theme.backgroundStyle).toBe("soft-gradient");
  });

  it("exports a responsive RTL portfolio with accessible, art-directed images", () => {
    const blocks = createStarterPortfolio();
    const hero = blocks.find((block) => block.type === "hero");
    const about = blocks.find((block) => block.type === "about");
    const projects = blocks.find((block) => block.type === "projects");
    if (hero?.type === "hero") {
      hero.heading = "مها حسن";
      hero.subline = "مصممة مستقلة";
      hero.avatarSrc = "data:image/webp;base64,AAAA";
      hero.avatarPosition = "top-right";
    }
    if (about?.type === "about") {
      about.body = "أصمم تجارب رقمية واضحة ومفيدة.";
      about.image = "data:image/webp;base64,AAAA";
      about.imageAlt = "صورة في مساحة العمل";
      about.imagePosition = "bottom-left";
    }
    if (projects?.type === "projects") projects.projects.push({
      id: "be058a3c-4f4a-4b6b-96ba-58a7b9c2875e",
      name: "مشروع تجريبي", description: "واجهة متجر إلكتروني", topics: [],
      image: "data:image/webp;base64,AAAA", imageAlt: "واجهة المتجر", imagePosition: "top-left", repoUrl: "", liveUrl: "",
    });
    const schema = parseSite({ version: 1, lang: "ar", theme: PRESET_THEMES[0]!.theme, blocks });
    expect(schema).not.toBeNull();
    const html = renderSite(schema!, { includeGoogleFonts: false });
    expect(html).toContain('<html lang="ar" dir="rtl">');
    expect(html).toContain("@media (max-width: 760px)");
    expect(html).toContain("folio-menu-toggle");
    expect(html).toContain("prefers-reduced-motion: reduce");
    expect(html).toContain('object-position:top right');
    expect(html).toContain('object-position:bottom left');
    expect(html).toContain('alt="واجهة المتجر"');
  });

  it("keeps a partially typed contact link in saved data and omits unsafe links in HTML", () => {
    const blocks = createStarterPortfolio();
    const contact = blocks.find((block) => block.type === "contact");
    if (contact?.type === "contact") contact.links.push({ platform: "Website", href: "javascript:alert(1)", label: "Website" });
    const schema = parseSite({ version: 1, theme: PRESET_THEMES[0]!.theme, blocks });
    expect(schema?.blocks.find((block) => block.type === "contact")).toMatchObject({
      links: [{ href: "javascript:alert(1)" }],
    });
    const html = renderSite(schema!, { includeGoogleFonts: false });
    expect(html).not.toContain('href="javascript:alert(1)"');
  });
});
