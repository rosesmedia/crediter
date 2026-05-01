import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { env } from "@repo/lib/env";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { AppLayout } from "@/app/_components/app-shell";
import { WebsocketProvider } from "@/app/_components/websocket-provider";
import { auth, signIn } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { MinioConfigProvider } from "../_components/minio-provider";

export const metadata: Metadata = {
  title: "Roses Media Crediter",
  description: "Hopefully making credits easier",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    return signIn();
  }

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MinioConfigProvider
          config={{
            MINIO_BUCKET: env.MINIO_BUCKET,
            MINIO_ENDPOINT: env.MINIO_ENDPOINT,
            MINIO_USE_SSL: env.MINIO_USE_SSL,
            MINIO_ANON_URL_BASE: env.MINIO_ANON_URL_BASE,
          }}
        >
          <SessionProvider>
            <WebsocketProvider>
              <TRPCReactProvider>
                <MantineProvider defaultColorScheme="auto">
                  <ModalsProvider>
                    <AppLayout>{children}</AppLayout>
                    <Notifications />
                  </ModalsProvider>
                </MantineProvider>
              </TRPCReactProvider>
            </WebsocketProvider>
          </SessionProvider>
        </MinioConfigProvider>
      </body>
    </html>
  );
}
