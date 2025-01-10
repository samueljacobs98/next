import { useCallback, useEffect, useRef } from "react";

export function useOptionalAutoscroll(
  isLoading: boolean,
  scrollIntoViewOptions: ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "end",
  }
) {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const containerEndRef = useRef<HTMLDivElement>(null);

  const autoScrollDisabledRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const autoscrollToBottom = useCallback(() => {
    if (containerEndRef.current) {
      containerEndRef.current.scrollIntoView(scrollIntoViewOptions);
    }
  }, [scrollIntoViewOptions]);

  useEffect(() => {
    if (isLoading) {
      autoScrollDisabledRef.current = false;
      lastScrollTopRef.current = 0;
    }
  }, [isLoading]);

  useEffect(() => {
    if (!innerContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const scrollable = outerContainerRef.current;
      if (!scrollable) return;

      if (!autoScrollDisabledRef.current) {
        autoscrollToBottom();
      }
    });

    resizeObserver.observe(innerContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [autoscrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = outerContainerRef.current;
      if (!scrollable) return;

      const scrollTop = scrollable.scrollTop;

      const scrollingUp = lastScrollTopRef.current - scrollTop > 0;

      if (scrollingUp) {
        autoScrollDisabledRef.current = true;
      } else {
        lastScrollTopRef.current = scrollTop;
      }
    };

    const scrollable = outerContainerRef.current;
    if (!scrollable) return;

    scrollable.addEventListener("scroll", handleScroll);

    return () => {
      scrollable.removeEventListener("scroll", handleScroll);
    };
  });

  return { outerContainerRef, innerContainerRef, containerEndRef };
}
