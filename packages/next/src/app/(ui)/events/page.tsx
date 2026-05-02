"use client";

import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Modal,
  Stack,
  Title,
} from "@mantine/core";
import { useSocketTriggeredFunction } from "@repo/lib/socket/client";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import z from "zod";
import { useAppForm } from "@/app/_components/form";
import { api } from "@/trpc/react";

export default function EventsPage() {
  const eventsQuery = api.events.list.useQuery();

  const [modalOpened, setModalOpened] = useState<"create" | undefined>();

  useSocketTriggeredFunction("update:events", () => eventsQuery.refetch());

  if (!eventsQuery.data?.ok) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  const events = eventsQuery.data.res;

  return (
    <>
      <Modal
        onClose={() => setModalOpened(undefined)}
        opened={modalOpened === "create"}
      >
        <CreateEventForm onSuccess={() => setModalOpened(undefined)} />
      </Modal>
      <Stack>
        <Button.Group>
          <Button component={Link} href={"/events/import"} color="green">
            Import from Scheduler
          </Button>
          <Button onClick={() => setModalOpened("create")}>Create Event</Button>
        </Button.Group>
        {events.map((event) => {
          return (
            <Card key={event.id} withBorder>
              <Group>
                <Title order={4}>{event.name}</Title>
                <ActionIcon
                  component={Link}
                  href={`/events/${event.id}`}
                  ml={"auto"}
                  variant="default"
                >
                  <FaEye />
                </ActionIcon>
              </Group>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}

function CreateEventForm(props: { onSuccess: () => void }) {
  const schema = z.object({ name: z.string(), date: z.string() });

  const createEvent = api.events.create.useMutation().mutateAsync;

  const form = useAppForm({
    validators: {
      onChange: schema,
    },
    defaultValues: {
      name: "",
      date: dayjs().format("YYYY-MM-DD"),
    },
    onSubmit: async ({ value }) => {
      const _res = await createEvent(value);

      props.onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="name">
        {(field) => <field.TextField label="Event Name" />}
      </form.AppField>

      <form.AppField name="date">
        {(field) => <field.DateField label="Event Date" />}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  );
}
