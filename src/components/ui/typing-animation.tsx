"use client";

import { cn } from "@/lib/utils";
import { useTypingAnimation } from "@/lib/state/hooks";
import { createElement, JSX } from "react";

export function TypingAnimation({
  duration = 200,
  as: Wrapper = "p",
  className,
  ...props
}: {
  text: string;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const text = useTypingAnimation(props.text, duration);

  if (!text) {
    return createElement(
      Wrapper,
      { className: cn(className, "opacity-0") },
      props.text
    );
  }

  return createElement(
    Wrapper,
    {
      className: cn(className),
    },
    text
  );
}
