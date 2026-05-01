import { Stack, Text, Title } from "@mantine/core";

export default async function Home() {
  return (
    <Stack>
      <Title>Roses Media Crediter</Title>
      <Text>
        It doesn't pull from Scheduler yet, but head to "Events" in the sidebar
        to create an event for your stream.
      </Text>
      <Text>
        To add to OBS, create a new scene named "Credits", and drag the
        downloaded file into the "Sources" section.
      </Text>
    </Stack>
  );
}
