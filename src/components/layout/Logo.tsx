import Link from "next/link";

/** "ZÉRO PITIÉ" stamp. Rendered as a link to the board, or as a plain block. */
export function Logo({ title = "ZÉRO PITIÉ", subtitle, href }: { title?: string; subtitle: string; href?: string }) {
  const className =
    "inline-flex -rotate-3 flex-col rounded-[10px] bg-ink px-[14px] pt-[7px] pb-[6px] leading-[.95] text-paper no-underline shadow-yellow-4";
  const content = (
    <>
      <b className="font-rough text-[24px] font-normal tracking-[.01em]">{title}</b>
      <small className="mt-[3px] font-display text-[9px] tracking-[.22em] text-yellow">{subtitle}</small>
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
}

/** Large outlined "ZÉRO / PITIÉ" title on the auth screens. */
export function HeroTitle({ top, bottom, small }: { top: string; bottom: string; small?: boolean }) {
  return (
    <h1
      className={
        "m-0 -rotate-4 font-rough leading-[.85] font-normal text-paper text-stroke-3 text-shadow-ink-6 " +
        (small ? "text-[clamp(40px,12vw,64px)]" : "text-[clamp(52px,16vw,88px)]")
      }
    >
      {top}
      <span className="block text-yellow">{bottom}</span>
    </h1>
  );
}
