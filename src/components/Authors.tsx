import { Fragment } from "react";

export function Authors({ authors, selfNames }: { authors: string[]; selfNames: string[] }) {
  return (
    <>
      {authors.map((a, i) => (
        <Fragment key={`${a}-${i}`}>
          {selfNames.includes(a) ? (
            <strong className="font-semibold text-fg underline decoration-gold-bright/70 decoration-2 underline-offset-[3px]">
              {a}
            </strong>
          ) : (
            a
          )}
          {i < authors.length - 2 ? ", " : i === authors.length - 2 ? (authors.length > 2 ? ", and " : " and ") : ""}
        </Fragment>
      ))}
    </>
  );
}
