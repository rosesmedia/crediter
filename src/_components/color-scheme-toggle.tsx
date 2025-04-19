"use client";

import {
  Center,
  type MantineColorScheme,
  SegmentedControl,
  type SegmentedControlProps,
  useMantineColorScheme,
  VisuallyHidden,
} from "@mantine/core";
import { MdLightMode, MdAutoMode, MdDarkMode } from "react-icons/md";

export function ColorSchemeToggle(
  props: Omit<SegmentedControlProps, "value" | "onChange" | "data">,
) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      {...props}
      value={colorScheme}
      onChange={(v: string) => setColorScheme(v as MantineColorScheme)}
      className="min-w-full"
      data={[
        {
          value: "light",
          label: (
            <Center>
              <MdLightMode className="scale-150" aria-label="light mode" />
              <VisuallyHidden>Light Mode</VisuallyHidden>
            </Center>
          ),
        },
        {
          value: "auto",
          label: (
            <Center>
              <MdAutoMode className="scale-150" aria-label="system theme" />
              <VisuallyHidden>System Theme</VisuallyHidden>
            </Center>
          ),
        },
        {
          value: "dark",
          label: (
            <Center>
              <MdDarkMode className="scale-150" aria-label="dark mode" />
              <VisuallyHidden>Dark Mode</VisuallyHidden>
            </Center>
          ),
        },
      ]}
    />
  );
}
