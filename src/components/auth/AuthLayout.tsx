import type { ReactNode } from "react";

/** Narrow centered column for the login and back-office sign-in screens. */
export function AuthLayout({ hero, children, footer }: { hero: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto mt-[4vh] grid max-w-[460px] gap-[22px]">
      <div className="grid justify-items-center gap-2.5 pt-2.5 text-center">{hero}</div>
      {children}
      {footer}
    </div>
  );
}
