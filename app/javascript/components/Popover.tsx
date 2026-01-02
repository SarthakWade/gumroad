import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { Details } from "$app/components/Details";
import { useGlobalEventListener } from "$app/components/useGlobalEventListener";
import { useOnOutsideClick } from "$app/components/useOnOutsideClick";

export type Props = {
  trigger: React.ReactNode | ((open: boolean) => React.ReactNode);
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  className?: string;
  dropdownClassName?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  style?: React.CSSProperties;
  position?: "top" | "bottom" | undefined;
  "aria-label"?: string;
  disabled?: boolean;
};

export const Popover = ({
  trigger,
  children,
  className: triggerClassName,
  dropdownClassName,
  open: openProp,
  onToggle,
  style,
  position,
  "aria-label": ariaLabel,
  disabled,
}: Props) => {
  const [open, setOpen] = React.useState(openProp ?? false);
  const ref = React.useRef<HTMLDetailsElement>(null);
  const dropoverPosition = useDropdownPosition(ref);

  if (openProp !== undefined && open !== openProp) setOpen(openProp);

  const toggle = (newOpen: boolean) => {
    if (openProp === undefined) setOpen(newOpen);
    if (newOpen !== open) onToggle?.(newOpen);
  };

  useOnOutsideClick([ref.current], () => toggle(false));
  useGlobalEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
      toggle(false);
    }
  });
  React.useEffect(() => {
    if (!open) return;
    const focusElement = ref.current?.querySelector("[autofocus]");
    if (focusElement instanceof HTMLElement) focusElement.focus();
  }, [open]);

  return (
    <Details
      className={classNames(
        "group relative inline-block",
        "popover toggle",
        // Arrow on popover container (visible only when open via CSS in .popover[open])
        // Arrow positioned between trigger and dropdown using ::after
        open &&
          "after:absolute after:left-1/2 after:z-30 after:-translate-x-1/2 after:border-x-8 after:border-x-transparent after:content-['']",
        open &&
          (position === "top"
            ? "after:bottom-full after:border-t-8 after:border-t-border"
            : "after:top-full after:border-b-8 after:border-b-border"),
        triggerClassName,
      )}
      open={open}
      onToggle={(nextOpen: boolean) => toggle(nextOpen)}
      ref={ref}
      style={style}
      summary={typeof trigger === "function" ? trigger(open) : trigger}
      summaryProps={{
        className: "list-none [&::-webkit-details-marker]:hidden",
        inert: disabled || undefined,
        "aria-label": ariaLabel,
        "aria-haspopup": "true",
        "aria-expanded": open,
      }}
    >
      <div
        className={classNames(
          "absolute top-full left-0 z-30 min-w-full rounded-md border border-border bg-background shadow-lg",
          // Hide the dropdown's own arrow (it's on the parent now)
          "before:hidden",
          // Top position variant
          position === "top" ? "top-auto bottom-full mb-2 shadow-none" : "mt-2",
          dropdownClassName,
        )}
        style={dropoverPosition}
      >
        {children instanceof Function ? children(() => toggle(false)) : children}
      </div>
    </Details>
  );
};

export const useDropdownPosition = (ref: React.RefObject<HTMLElement>) => {
  const [space, setSpace] = React.useState(0);
  const [maxWidth, setMaxWidth] = React.useState(0);
  React.useEffect(() => {
    const calculateSpace = () => {
      if (!ref.current?.parentElement) return;
      let scrollContainer = ref.current.parentElement;
      while (getComputedStyle(scrollContainer).overflow === "visible" && scrollContainer.parentElement !== null) {
        scrollContainer = scrollContainer.parentElement;
      }
      setSpace(
        scrollContainer.clientWidth -
          (ref.current.getBoundingClientRect().left - scrollContainer.getBoundingClientRect().left),
      );
      setMaxWidth(scrollContainer.clientWidth);
    };
    calculateSpace();
    window.addEventListener("resize", calculateSpace);

    return () => window.removeEventListener("resize", calculateSpace);
  }, []);

  return {
    translate: `min(${space}px - 100% - var(--spacer-4), 0px)`,
    maxWidth: `calc(${maxWidth}px - 2 * var(--spacer-4))`,
  };
};
