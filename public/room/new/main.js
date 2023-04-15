window.addEventListener("load", () => {
  const formNewRoom = document.getElementById("formNewRoom");

  formNewRoom.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;

    const newRoom = {
      name,
      location
    };

    try {
      await fetch("/api/rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRoom)
      });

      window.location.replace("/");
    } catch (e) {
      alert("Failed to create new room.");
    }
  });
});
