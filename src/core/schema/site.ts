import { z } from "zod";
import { ThemeTokensSchema } from "./theme";
import { BlockSchema } from "./blocks";

export const PortfolioExperienceSchema = z.object({
  navigation: z.boolean().default(true),
  stickyNavigation: z.boolean().default(true),
  navigationStyle: z.enum(["minimal", "glass", "pill", "underline", "solid", "floating", "gradient", "outline", "editorial", "command", "segmented"]).default("glass"),
  navigationLayout: z.enum(["left", "center", "right"]).default("center"),
  navigationSize: z.enum(["compact", "standard", "large"]).default("standard"),
  navigationShowBrand: z.boolean().default(true),
  navigationBrandLabel: z.string().max(60).default(""),
  navigationItems: z.array(z.object({
    section: z.enum(["about", "projects", "skills", "experience", "contact"]),
    label: z.string().max(40).default(""),
    enabled: z.boolean().default(true),
  })).max(8).default([]),
  motion: z.enum(["none", "subtle", "expressive"]).default("subtle"),
  sectionDivider: z.enum(["auto", "glow", "diamond", "double", "dashed", "none"]).default("auto"),
  scrollProgress: z.boolean().default(true),
  backToTop: z.boolean().default(true),
  imageLightbox: z.boolean().default(true),
  showFooter: z.boolean().default(true),
}).default({});

// ─── Root schema — version-stamped for safe migrations ────────────────────────
export const SiteSchemaV1 = z.object({
  version: z.literal(1),
  lang:    z.enum(["en", "ar"]).default("en"),
  metaTitle: z.string().max(120).default("My Portfolio"),
  metaDesc:  z.string().max(300).default(""),
  experience: PortfolioExperienceSchema,
  theme:   ThemeTokensSchema,
  blocks:  z.array(BlockSchema).max(30).default([]),
});

export type SiteSchema = z.infer<typeof SiteSchemaV1>;

// Convenient alias used everywhere
export { SiteSchemaV1 as SiteSchema };
