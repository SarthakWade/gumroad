import * as React from "react";

import { classNames } from "$app/utils/classNames";

type DropdownProps = {
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
};

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, showArrow = true, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames(
        "relative mt-2 max-w-[calc(100vw-2rem)] rounded border border-border bg-background p-4 text-foreground",
        // Arrow using CSS border trick
        showArrow &&
          "before:absolute before:bottom-full before:left-3 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-border before:content-['']",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Dropdown.displayName = "Dropdown";
