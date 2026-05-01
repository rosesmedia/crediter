import { api } from "@/trpc/server";

const SCREEN_HEIGHT = 1080;

function RoleName(props: { roleName: string }) {
  return (
    <div
      className="roses-title-text"
      style={{
        fontSize: "70px",
      }}
    >
      {props.roleName}
    </div>
  );
}

function PersonName(props: { personName: string }) {
  return (
    <div
      className="roses-body-text"
      style={{
        fontSize: "50px",
      }}
    >
      {props.personName}
    </div>
  );
}

export default async function CreditsPage({
  params: asyncParams,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const params = await asyncParams;

  const event = await api.events.readRoles(params);

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "red",
        display: "grid",
        width: "100vw",
        placeItems: "center",
        paddingTop: SCREEN_HEIGHT,
        paddingBottom: SCREEN_HEIGHT,
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        {event?.credit_roles.map((role, idx) => {
          return (
            <div
              key={role.id}
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <RoleName roleName={role.name} />
              {role.names.map((creditName) => {
                return (
                  <PersonName
                    key={creditName.id}
                    personName={creditName.name}
                  />
                );
              })}
              {idx !== event?.credit_roles.length - 1 && (
                <div
                  style={{
                    height: "50px",
                    width: "100%",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
