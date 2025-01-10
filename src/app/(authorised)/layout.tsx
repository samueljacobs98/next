import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center overflow-hidden h-screen max-h-screen">
      {children}
    </main>
  );
}
