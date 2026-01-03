import * as React from "react";

import { Icon } from "$app/components/Icons";
import { Popover } from "$app/components/Popover";

type User = { name: string | null; email: string | null; avatarUrl: string };

export const DashboardNavProfilePopover = ({ children, user }: { children: React.ReactNode; user: User | null }) => (
  <Popover
    position="top"
    trigger={(open) => (
      <div className="inline-flex px-6 py-4 hover:text-accent">
        <div className="flex-1 truncate">
          <img
            className="user-avatar mr-3 border border-white bg-black dark:border-foreground/35"
            src={user?.avatarUrl}
            alt="Your avatar"
          />
          {user?.name || user?.email}
        </div>
        <Icon name={open ? "outline-cheveron-up" : "outline-cheveron-down"} />
      </div>
    )}
    className="border-y border-transparent after:border-t-black dark:border-transparent dark:after:border-t-black"
    dropdownClassName="mx-4 rounded-none border-none bg-transparent p-0 py-2 text-white shadow-none"
  >
    {children}
  </Popover>
);
