export default function CreditsPage() {
  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
        backgroundColor: "black",
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
        <div
          className="roses-title-text"
          style={{
            fontSize: "70px",
          }}
        >
          TV Producer
        </div>
        <div
          className="roses-body-text blink"
          style={{
            fontSize: "50px",
          }}
        >
          Mia Moir
        </div>
        <div
          className="roses-title-text"
          style={{
            fontSize: "70px",
            marginTop: "50px",
          }}
        >
          Camera Operators
        </div>
        <div
          className="roses-body-text"
          style={{
            fontSize: "50px",
          }}
        >
          Mia Moir
        </div>
        <div
          className="roses-body-text"
          style={{
            fontSize: "50px",
          }}
        >
          Bossman Redfighter
        </div>
        <div
          className="roses-body-text"
          style={{
            fontSize: "50px",
          }}
        >
          Bossman Bluefighter
        </div>
      </div>
    </div>
  );
}
