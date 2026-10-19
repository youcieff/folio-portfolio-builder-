import type { TemplateId } from "../../schema";
import { terminalCss }      from "./terminal";
import { midnightGlassCss } from "./midnight-glass";
import { editorialCss }      from "./editorial";
import { brutalistCss }      from "./brutalist";

export function getTemplateCss(id: TemplateId): string {
  switch (id) {
    case "terminal":       return terminalCss;
    case "midnight-glass": return midnightGlassCss;
    case "editorial":      return editorialCss;
    case "brutalist":      return brutalistCss;
  }
}
