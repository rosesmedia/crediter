"use client";

import { AppShell, Burger, Group, Skeleton, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type React from "react";
import { ColorSchemeToggle } from "./color-scheme-toggle";

export function CrediterAppShell(props: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Title>Crediter?</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        <ColorSchemeToggle mt={"auto"} />
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
}
