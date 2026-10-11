"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

type Point = { label: string; value: number; group?: string };
type Segment = { role: string; org: string; period: string; start: number; end: number; current: boolean };

type Props = {
  publications: Point[];
  sections: Point[];
  supervision: Point[];
  career: Segment[];
  axisStart: number;
  axisEnd: number;
};

/** Hover + arrow-key scrubbing over n marks. */
function useScrub(n: number) {
  const [active, setActive] = useState<number | null>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    setActive((a) => Math.min(n - 1, Math.max(0, (a ?? (step > 0 ? -1 : n)) + step)));
  };
  return { active, setActive, onKeyDown, onBlur: () => setActive(null), onMouseLeave: () => setActive(null) };
}

const dim = (active: number | null, i: number, to = 0.3) => (active !== null && active !== i ? to : 1);

function Panel({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col py-6 lg:px-6 lg:py-1 lg:first:pl-0 lg:last:pr-0">
      <p className="text-[13px] font-medium text-fg-2">{label}</p>
      <p className="mt-1 text-[2.5rem] leading-none font-semibold tracking-tight text-fg">{value}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Readout({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 min-h-[1.25rem] text-[12.5px] text-muted" aria-live="polite">
      {children}
    </p>
  );
}

function Columns({ data, unit, groups = false }: { data: Point[]; unit: string; groups?: boolean }) {
  const { active, setActive, ...handlers } = useScrub(data.length);
  const max = Math.max(1, ...data.map((d) => d.value));
  const runs = data.reduce<{ group: string; n: number }[]>((acc, d) => {
    const last = acc[acc.length - 1];
    if (last && last.group === d.group) last.n++;
    else acc.push({ group: d.group ?? "", n: 1 });
    return acc;
  }, []);
  const peak = Math.max(...data.map((d) => d.value));
  const peakLabels = data.filter((d) => d.value === peak).map((d) => d.label);
  const a = active === null ? null : data[active];

  return (
    <>
      <div
        tabIndex={0}
        role="group"
        aria-label={`${unit} from ${data[0].label} to ${data[data.length - 1].label}. Use the arrow keys to read values.`}
        className="flex h-14 items-end gap-[2px] border-b border-line-strong outline-offset-4"
        {...handlers}
      >
        {data.map((d, i) => (
          <div
            key={d.label}
            onMouseEnter={() => setActive(i)}
            className="flex h-full min-w-0 flex-1 items-end justify-center"
          >
            <span
              className="grow-y block w-full max-w-[14px] rounded-t-[2px] bg-chart transition-opacity duration-200"
              style={{
                height: d.value ? `${Math.max(6, (d.value / max) * 100)}%` : 0,
                opacity: dim(active, i),
                animationDelay: `${600 + i * 35}ms`,
              }}
            />
          </div>
        ))}
      </div>
      {groups ? (
        <div className="mt-1.5 flex text-[11px] text-muted">
          {runs.map((r) => (
            <span key={r.group} style={{ flex: `${r.n} 1 0` }} className="truncate border-l border-line-strong pl-1">
              {r.group}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-1.5 flex justify-between text-[11px] text-muted tabular-nums">
          <span>{data[0].label}</span>
          <span>{data[data.length - 1].label}</span>
        </div>
      )}
      <Readout>
        {a ? (
          <>
            <span className="font-semibold text-fg">{a.label}</span> · {a.value} {unit}
            {a.group && <> · {a.group}</>}
          </>
        ) : groups ? (
          `${data.length} semesters at ${runs.length} universities`
        ) : (
          `Peak of ${peak} in ${peakLabels.join(" and ")}`
        )}
      </Readout>
    </>
  );
}

function Bars({ data }: { data: Point[] }) {
  const { active, setActive, onMouseLeave } = useScrub(data.length);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <>
      <ul className="space-y-[7px]" onMouseLeave={onMouseLeave}>
        {data.map((d, i) => (
          <li
            key={d.label}
            onMouseEnter={() => setActive(i)}
            className="grid grid-cols-[108px_minmax(0,1fr)_20px] items-center gap-2 text-[12px] transition-opacity duration-200"
            style={{ opacity: dim(active, i, 0.45) }}
          >
            <span className="truncate text-fg-2">{d.label}</span>
            <span className="block h-[7px]">
              <span
                className="grow-x block h-full rounded-r-[2px] bg-chart"
                style={{ width: `${(d.value / max) * 100}%`, animationDelay: `${650 + i * 60}ms` }}
              />
            </span>
            <span className="text-right text-fg tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
      <Readout>By research area</Readout>
    </>
  );
}

function Timeline({ segments, start, end }: { segments: Segment[]; start: number; end: number }) {
  const { active, setActive, ...handlers } = useScrub(segments.length);
  const x = (v: number) => ((v - start) / (end - start)) * 100;
  const ticks: number[] = [];
  for (let y = Math.ceil(start); y <= end; y += 4) ticks.push(y);
  // One row per institution (a small Gantt chart), oldest first.
  const rows = segments.reduce<{ org: string; items: { s: Segment; i: number }[] }[]>((acc, s, i) => {
    const row = acc.find((r) => r.org === s.org);
    if (row) row.items.push({ s, i });
    else acc.push({ org: s.org, items: [{ s, i }] });
    return acc;
  }, []);
  const a = active === null ? null : segments[active];
  const current = segments.find((s) => s.current);

  return (
    <>
      <div
        tabIndex={0}
        role="group"
        aria-label="Academic appointments over time. Use the arrow keys to read each role."
        className="outline-offset-4"
        {...handlers}
      >
        {rows.map((row) => (
          <div key={row.org} className="grid h-[18px] grid-cols-[44px_minmax(0,1fr)] items-center gap-2 text-[12px]">
            <span className="text-fg-2">{row.org}</span>
            <div className="relative h-full">
              {row.items.map(({ s, i }) => (
                <div
                  key={s.role}
                  onMouseEnter={() => setActive(i)}
                  className="absolute inset-y-0 flex items-center"
                  style={{ left: `${x(s.start)}%`, width: `${x(s.end) - x(s.start)}%` }}
                >
                  <span
                    className="grow-x mx-px block h-[7px] w-full rounded-[2px] transition-opacity duration-200"
                    style={{
                      background: s.current ? "var(--chart)" : "var(--chart-soft)",
                      opacity: dim(active, i, 0.4),
                      animationDelay: `${650 + i * 90}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-2">
          <span />
          <div className="relative mt-1 h-4 border-t border-line-strong text-[11px] text-muted tabular-nums">
            {ticks.map((t) => {
              const pos = x(t);
              const align = pos < 6 ? "" : pos > 94 ? "-translate-x-full" : "-translate-x-1/2";
              return (
                <span key={t} className={`absolute top-1 ${align}`} style={{ left: `${pos}%` }}>
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <Readout>
        {a ? (
          <>
            <span className="font-semibold text-fg">{a.role}</span> · {a.period}
          </>
        ) : (
          current && `${current.role} since ${current.period.split(" – ")[0]}`
        )}
      </Readout>
    </>
  );
}

export function GlanceRow({ publications, sections, supervision, career, axisStart, axisEnd }: Props) {
  const sum = (d: Point[]) => d.reduce((n, p) => n + p.value, 0);
  const years = Math.floor(axisEnd - career[0].start);

  return (
    <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
      <Panel label="Peer-reviewed publications" value={String(sum(publications))}>
        <Columns data={publications} unit="papers" />
      </Panel>
      <Panel label="Course sections taught" value={String(sum(sections))}>
        <Columns data={sections} unit="sections" groups />
      </Panel>
      <Panel label="Theses & projects supervised" value={String(sum(supervision))}>
        <Bars data={supervision} />
      </Panel>
      <Panel label="Years in academia" value={`${years}+`}>
        <Timeline segments={career} start={axisStart} end={axisEnd} />
      </Panel>
    </div>
  );
}
