"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

type Props = {
  onConfirm: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
};

/** First tap arms the button ("Sûr ?") for 3 s, second tap confirms. */
export function ConfirmButton({ onConfirm, children, variant, size, className, ...rest }: Props) {
  const { t } = useI18n();
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleClick() {
    clearTimeout(timer.current);
    if (armed) {
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 3000);
  }

  return (
    <Button variant={variant} size={size} armed={armed} className={className} onClick={handleClick} {...rest}>
      {armed ? t.common.sure : children}
    </Button>
  );
}
