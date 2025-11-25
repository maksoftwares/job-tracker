import React from "react";

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">{children}</main>;
}
