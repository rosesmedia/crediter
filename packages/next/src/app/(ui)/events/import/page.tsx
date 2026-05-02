"use client";

import { api } from "@/trpc/react";
import {
  Alert,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
export default function SchedulerImportPage() {
  const schedulerEventsQuery = api.scheduler.list.useQuery();
  const schedulerImportEvent = api.scheduler.import.useMutation().mutateAsync;

  const [search, setSearch] = useState("");
  const router = useRouter();

  const schedulerEvents = schedulerEventsQuery.data?.res.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Stack>
      <Alert color="orange" icon={<IoWarningOutline />}>
        Only import your event when your crew is final
      </Alert>
      <Title>Scheduler Import</Title>
      {!schedulerEvents ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {schedulerEvents.map((e) => (
                <Table.Tr key={e.id}>
                  <Table.Td>
                    <Group>
                      {e.name}
                      <Button
                        ml={"auto"}
                        onClick={async () => {
                          const event = await schedulerImportEvent({
                            fixtureId: e.id,
                          });

                          router.push(`/events/${event.res?.id}`);
                        }}
                      >
                        Import
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Stack>
  );
}
