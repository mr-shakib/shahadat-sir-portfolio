"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";

/** Photo grid for a moment card; clicking a photo opens it in a lightbox. */
export function MomentPhotos({ images, title }: { images: string[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  });

  const layout =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2";
  // The card shows three photos at most; the last tile says how many more the lightbox holds.
  const shown = images.slice(0, 3);
  const more = images.length - shown.length;

  return (
    <>
      <div className={`grid aspect-[4/3] gap-[2px] bg-line ${layout}`}>
        {shown.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            className="group relative overflow-hidden bg-surface-2"
            aria-label={`View photo ${i + 1} of ${images.length}: ${title}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            {more > 0 && i === shown.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-lg font-semibold text-white">
                +{more}
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label={title}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[92dvh] max-w-[min(92vw,1100px)] overflow-visible bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        <figure className="relative">
          <img
            src={images[index]}
            alt={`${title}, photo ${index + 1} of ${images.length}`}
            className="max-h-[84dvh] w-auto max-w-full rounded-lg object-contain shadow-card-lg"
          />
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-on-ink">
            <span className="truncate">{title}</span>
            {images.length > 1 && (
              <span className="shrink-0 text-on-ink-muted tabular-nums">
                {index + 1} / {images.length}
              </span>
            )}
          </figcaption>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute -top-3 -right-3 inline-flex size-9 items-center justify-center rounded-full bg-surface text-fg shadow-card-lg"
          >
            <LuX className="size-4" aria-hidden />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow-card"
              >
                <LuChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow-card"
              >
                <LuChevronRight className="size-5" aria-hidden />
              </button>
            </>
          )}
        </figure>
      </dialog>
    </>
  );
}
