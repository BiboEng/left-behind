// AI-assisted with Devin. Learning feedback follows the linked NASA evidence.
import { useState } from "react";
import { explorerQuestions } from "../data/explorer";

export default function ExplorerQuestion({ relicId }: { relicId: string }) {
  const question = explorerQuestions[relicId];
  const [selected, setSelected] = useState<number | null>(null);
  if (!question) return null;
  return (
    <section className="explorer-question" aria-label="Explorer question">
      <p className="kicker mono">Think like an explorer</p>
      <fieldset>
        <legend>{question.question}</legend>
        <div className="explorer-options">
          {question.options.map((option, i) => (
            <button type="button" key={option} aria-pressed={selected === i}
              disabled={selected !== null} onClick={() => setSelected(i)}
              data-correct={selected !== null && i === question.answer}>
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <div role="status" className="explorer-feedback">
        {selected !== null && <>
          <p><strong>{selected === question.answer ? "That's it." : "The story gives a different clue."}</strong> {question.explanation}</p>
          <a href={question.sourceUrl} target="_blank" rel="noreferrer">Follow the NASA evidence <span aria-hidden>↗</span></a>
          <button className="back" onClick={() => setSelected(null)}>Try again</button>
        </>}
      </div>
    </section>
  );
}
