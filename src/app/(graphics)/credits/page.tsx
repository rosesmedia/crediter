"use client";

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

enum heights {
  RoleName = 105,
  PersonName = 75,
  Gap = 50,
}

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

export default function CreditsPage() {
  let height = 0;

  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
        backgroundColor: height >= 1080 ? "red" : "black",
        color: "white",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        {credits.map((role, idx) => {
          height += heights.RoleName;
          console.log(height);
          return (
            <div
              key={idx}
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <RoleName roleName={role.roleName} />
              {role.names.map((personName, idx) => {
                height += heights.PersonName;
                if (idx !== credits.length - 1) {
                  height += heights.Gap;
                  console.log(height);
                } else {
                  console.log(height);
                }
                return <PersonName personName={personName} key={idx} />;
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
