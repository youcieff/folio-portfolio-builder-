import { z } from "zod";

// Shared helpers
const uuid = z.string().uuid();
// Keep in-progress edits in autosaves; hrefAttr sanitises these strings at render time.
const safeUrl = z.string().max(2048);
export const ImagePositionSchema = z.enum(["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]);
export type ImagePosition = z.infer<typeof ImagePositionSchema>;

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HeroBlockSchema = z.object({
  id:         uuid,
  type:       z.literal("hero"),
  heading:    z.string().max(120).default(""),
  subline:    z.string().max(240).default(""),
  eyebrow:    z.string().max(60).default(""),
  ctaLabel:   z.string().max(40).default(""),
  ctaHref:    safeUrl.or(z.string().regex(/^#/)).default(""),
  avatarAlt:  z.string().max(120).default(""),
  // data-URI or empty — never an external URL in the exported file
  avatarSrc:  z.string().max(2_000_000).default(""),
  backgroundSrc: z.string().max(2_000_000).default(""),
  layout: z.enum(["split", "centered", "photo-first", "banner"]).default("split"),
  avatarShape: z.enum(["rounded", "circle", "square"]).default("rounded"),
  avatarPosition: ImagePositionSchema.default("center"),
  backgroundPosition: z.enum(["center", "top", "bottom", "left", "right"]).default("center"),
  // Terminal template: types the heading character by character
  typewriter: z.boolean().default(false),
});

export type HeroBlock = z.infer<typeof HeroBlockSchema>;

// ─── About ────────────────────────────────────────────────────────────────────
export const AboutBlockSchema = z.object({
  id:   uuid,
  type: z.literal("about"),
  heading: z.string().max(80).default("About"),
  body: z.string().max(2000).default(""),
  image: z.string().max(2_000_000).default(""),
  imageAlt: z.string().max(120).default(""),
  imagePosition: ImagePositionSchema.default("center"),
  facts: z
    .array(
      z.object({
        label: z.string().max(60),
        value: z.string().max(120),
      })
    )
    .max(8)
    .default([]),
});

export type AboutBlock = z.infer<typeof AboutBlockSchema>;

// ─── Projects ─────────────────────────────────────────────────────────────────
export const ProjectSchema = z.object({
  id:          uuid,
  name:        z.string().max(80),
  description: z.string().max(400).default(""),
  topics:      z.array(z.string().max(30)).max(10).default([]),
  // Uploaded images are embedded as data URIs so exported portfolios stay portable.
  image:       z.string().max(2_000_000).default(""),
  imageAlt:    z.string().max(120).default(""),
  imagePosition: ImagePositionSchema.default("center"),
  repoUrl:     safeUrl.default(""),
  liveUrl:     safeUrl.default(""),
  stars:       z.number().int().min(0).optional(),
  language:    z.string().max(30).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsBlockSchema = z.object({
  id:       uuid,
  type:     z.literal("projects"),
  heading:  z.string().max(80).default("Projects"),
  layout: z.enum(["grid", "feature", "list"]).default("grid"),
  projects: z.array(ProjectSchema).max(20).default([]),
});

export type ProjectsBlock = z.infer<typeof ProjectsBlockSchema>;

// ─── Skills ───────────────────────────────────────────────────────────────────
export const SkillGroupSchema = z.object({
  label:  z.string().max(60),
  skills: z.array(z.string().max(40)).max(20),
});

export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const SkillsBlockSchema = z.object({
  id:      uuid,
  type:    z.literal("skills"),
  heading: z.string().max(80).default("Skills"),
  groups:  z.array(SkillGroupSchema).max(6).default([]),
});

export type SkillsBlock = z.infer<typeof SkillsBlockSchema>;

// ─── Timeline ─────────────────────────────────────────────────────────────────
export const TimelineEntrySchema = z.object({
  id:          uuid,
  period:      z.string().max(40).default(""),
  role:        z.string().max(100).default(""),
  org:         z.string().max(100).default(""),
  description: z.string().max(600).default(""),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

export const TimelineBlockSchema = z.object({
  id:      uuid,
  type:    z.literal("timeline"),
  heading: z.string().max(80).default("Experience"),
  entries: z.array(TimelineEntrySchema).max(12).default([]),
});

export type TimelineBlock = z.infer<typeof TimelineBlockSchema>;

// ─── Contact ──────────────────────────────────────────────────────────────────
export const ContactLinkSchema = z.object({
  platform: z.string().max(40),
  // email addresses are valid too
  // Keep partial links while editing; hrefAttr sanitises them at render time.
  href:     z.string().max(2048).default(""),
  label:    z.string().max(80).default(""),
});

export type ContactLink = z.infer<typeof ContactLinkSchema>;

export const ContactBlockSchema = z.object({
  id:      uuid,
  type:    z.literal("contact"),
  heading: z.string().max(80).default("Say hello"),
  note:    z.string().max(400).default(""),
  links:   z.array(ContactLinkSchema).max(8).default([]),
});

export type ContactBlock = z.infer<typeof ContactBlockSchema>;

// ─── Discriminated union — exhaustive switch guard ────────────────────────────
export const BlockSchema = z.discriminatedUnion("type", [
  HeroBlockSchema,
  AboutBlockSchema,
  ProjectsBlockSchema,
  SkillsBlockSchema,
  TimelineBlockSchema,
  ContactBlockSchema,
]);

export type Block = z.infer<typeof BlockSchema>;

// The never-guard ensures every switch over Block is exhaustive at compile time.
// Usage: default: assertNever(block)
export function assertNever(x: never): never {
  throw new Error(`Unhandled block type: ${JSON.stringify(x)}`);
}
