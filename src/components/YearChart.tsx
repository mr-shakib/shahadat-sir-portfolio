"use client";

import { useState } from "react";

type Props = {
  data: { year: number; count: number }[];
  selected: number | null;
  onSelect: (year: number | null) => void;
};

const PLOT_H = 148;

function niceMax(v: number) {
  if (v <= 4) return 4;
  const step = v <= 10 ? 2 : v <= 20 ? 5 : 10;
  return Math.ceil(v / step) * step;
}

/** Single-series column chart: publications per year. Columns are buttons that filter the list. */
export function YearChart({ data, selected, onSelect }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const top = niceMax(max);
  const step = top / 2;
  const ticks = [0, step, top];
  const peak = Math.max(...data.map((d) => d.count));

  return (
    <figure className="w-full">
      <div className="relative flex" style={{ height: PLOT_H + 28 }}>
        {/* y-axis ticks */}
        <div className="relative w-7 shrink-0 text-right text-[11px] text-muted tabular-nums" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 -translate-y-1/2" style={{ top: PLOT_H - (t / top) * PLOT_H }}>
              {t}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* gridlines */}
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden
              className={`absolute inset-x-0 h-px ${t === 0 ? "bg-line-strong" : "bg-line"}`}
              style={{ top: PLOT_H - (t / top) * PLOT_H }}
            />
          ))}

          <div className="absolute inset-x-0 top-0 flex" style={{ height: PLOT_H + 28 }}>
            {data.map((d) => {
              const h = d.count === 0 ? 0 : Math.max(3, (d.count / top) * PLOT_H);
              const active = hover === d.year || selected === d.year;
              const dim = selected !== null && selected !== d.year;
              const showLabel = d.count > 0 && (d.count === peak || active);
              return (
                <button
                  key={d.year}
                  type="button"
                  disabled={d.count === 0}
                  onClick={() => onSelect(selected === d.year ? null : d.year)}
                  onMouseEnter={() => setHover(d.year)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(d.year)}
                  onBlur={() => setHover(null)}
                  aria-pressed={selected === d.year}
                  aria-label={`${d.year}: ${d.count} publication${d.count === 1 ? "" : "s"}${
                    d.count ? (selected === d.year ? ". Click to clear filter" : ". Click to filter by this year") : ""
                  }`}
                  className="group relative flex min-w-0 flex-1 cursor-pointer flex-col items-center rounded-md outline-offset-0 disabled:cursor-default"
                >
                  {/* hover band */}
                  <span
                    aria-hidden
                    className={`absolute inset-x-1 top-0 rounded-md transition-colors ${active ? "bg-surface-2" : ""}`}
                    style={{ height: PLOT_H }}
                  />
                  <span className="relative block w-full" style={{ height: PLOT_H }}>
                    {showLabel && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-[12px] font-semibold text-fg tabular-nums"
                        style={{ bottom: h + 4 }}
                      >
                        {d.count}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-1/2 w-[min(24px,60%)] -translate-x-1/2 rounded-t-[4px] bg-chart transition-[opacity,height] duration-300"
                      style={{ height: h, opacity: dim ? 0.3 : 1 }}
                    />
                  </span>
                  <span
                    className={`mt-2 text-[11.5px] tabular-nums ${
                      selected === d.year ? "font-semibold text-fg" : "text-muted"
                    }`}
                  >
                    {d.year}
                  </span>
                  {hover === d.year && d.count > 0 && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute z-10 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-left text-xs whitespace-nowrap text-fg shadow-card-lg"
                      // the button is PLOT_H + 28 tall; sit just above the bar's value label
                      style={{ bottom: h + 50 }}
                    >
                      <span className="block font-semibold">{d.year}</span>
                      <span className="text-muted">
                        {d.count} publication{d.count === 1 ? "" : "s"}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Publications per year</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Publications</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.year}>
              <td>{d.year}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
