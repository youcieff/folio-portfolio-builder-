import type { Block } from "./schema";
import { generateId } from "./utils/id";

/** A complete, editable portfolio structure. Empty copy stays honest and easy to replace. */
export function createStarterPortfolio(lang: "en" | "ar" = "en"): Block[] {
  const headings = lang === "ar"
    ? { hero: "اسمك", about: "نبذة عني", projects: "أعمال مختارة", skills: "مهاراتي", timeline: "الخبرات", contact: "لنتواصل" }
    : { hero: "Your name", about: "About", projects: "Selected work", skills: "What I bring", timeline: "Experience", contact: "Let's work together" };
  return [
    {
      id: generateId(), type: "hero", heading: headings.hero,
      subline: "",
      eyebrow: "", ctaLabel: "", ctaHref: "", avatarAlt: "", avatarSrc: "", backgroundSrc: "", layout: "split", avatarShape: "rounded", avatarPosition: "center", backgroundPosition: "center", typewriter: false,
    },
    { id: generateId(), type: "about", heading: headings.about, body: "", image: "", imageAlt: "", imagePosition: "center", facts: [] },
    {
      id: generateId(), type: "projects", heading: headings.projects, layout: "feature",
      projects: [],
    },
    { id: generateId(), type: "skills", heading: headings.skills, groups: [] },
    { id: generateId(), type: "timeline", heading: headings.timeline, entries: [] },
    { id: generateId(), type: "contact", heading: headings.contact, note: "", links: [] },
  ];
}
