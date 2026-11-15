// The big year in the top bar, drawn as an odometer: each digit is a strip "0 1 2 … 9" in a
// one-digit-tall window, and changing year slides each strip to its new digit (1969 → 1971 rolls
// only the last two). Pure CSS transforms; prefers-reduced-motion turns the slide off (index.css).
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function YearCounter({ year, className }: { year: string; className?: string }) {
  return (
    // aria-hidden: the overlay announces the year and name in one line for screen readers.
    <p className={`year-counter ${className ?? ""}`} aria-hidden>
      {year.split("").map((ch, i) => {
        const d = Number(ch);
        if (Number.isNaN(d)) return <span key={i}>{ch}</span>;
        return (
          <span key={i} className="odo-digit">
            <span className="odo-strip" style={{ transform: `translateY(${-d * 10}%)` }}>
              {DIGITS.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
    </p>
  );
}
