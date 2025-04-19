import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          width: "1920px",
          height: "1080px",
          overflow: "hidden",
        }}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
