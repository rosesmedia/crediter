const credits = [
  {
    roleName: "Vision Mixer",
    names: ["Sam Rooke"],
  },
  {
    roleName: "Camera Operators",
    names: ["Maisie Clegg", "Megan Thomason", "Robbin Driver"],
  },
];

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

export default async function CreditsPage() {
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
        {credits.map((role, idx) => {
          return (
            <div
              key={role.roleName}
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <RoleName roleName={role.roleName} />
              {role.names.map((personName) => {
                return <PersonName key={personName} personName={personName} />;
              })}
              {idx !== credits.length - 1 && (
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
