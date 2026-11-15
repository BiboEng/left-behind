import { caseById, signalAudio, signalMedia, signalSources, type CaseId } from "./signal";
import { cleanText, DEFAULT_EXHIBIT_TITLE, MAX_CAPTION, MAX_TITLE } from "../state/signal";

export interface Exhibition {
  cards: CaseId[];
  title: string;
  caption: string;
}
/** Plain text is portable for teachers and preserves attribution without executing any markup. */
export function exhibitionText(exhibition: Exhibition) {
  const lines = [
    cleanText(exhibition.title, MAX_TITLE) || DEFAULT_EXHIBIT_TITLE,
    "LEFT BEHIND / AFTER THE SIGNAL",
    "A reader-curated exhibition of NASA evidence.", "",
  ];
  const caption = cleanText(exhibition.caption, MAX_CAPTION);
  if (caption) lines.push("READER'S CAPTION (not a NASA statement)", caption, "");
  for (const id of [...new Set(exhibition.cards)]) {
    const item = caseById.get(id);
    if (!item) continue;
    const media = signalMedia[item.media];
    lines.push(item.exhibitLabel, item.title, item.date, "",
      "OBSERVATION", item.observation, "",
      "INTERPRETATION", item.interpretation, "",
      "LIMIT", item.limit, "",
      "LEGACY", item.legacy, "",
      "IMAGE", media.caption, media.credit, signalSources[media.source].url,
      "Image processing: " + media.processing, "",
      "SOURCES", ...item.sources.map((key) => signalSources[key].title + "\n" + signalSources[key].url));
    if (id === "insight") lines.push("", "AUDIO", signalAudio.credit, signalAudio.processing, signalAudio.description, signalAudio.original);
    lines.push("", "--------------------", "");
  }
  lines.push("For a classroom: separate an observation, an interpretation and an unanswered question.",
    "AI-assisted editorial draft. Human source verification is still pending. This exhibition makes no claim of NASA endorsement.",
    "Original imagery and the InSight audio are credited to their creators; the exhibition text is the project's educational interpretation.");
  return lines.join("\n") + "\n";
}
