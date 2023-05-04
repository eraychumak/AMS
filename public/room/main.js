const params = new URLSearchParams(window.location.search);

const roomID = params.get("id");

if (roomID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const req = await fetch(`/api/rooms?id=${roomID}`);

    if (req.status !== 200) {
      return;
    }

    const room = (await req.json())[0];

    if (!room) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useRoomName");

    document.title = `AMS - ${room.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = room.name;
        continue;
      }

      htmlNameElement.textContent = room.name;
    }

    const htmlLocation = document.getElementById("location");
    htmlLocation.value = room.location;

    const htmlDelRoom = document.getElementById("delRoom");
    htmlDelRoom.innerText = `Delete '${room.name}' room`;

    htmlDelRoom.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The room was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/rooms/${room.id}`, {
          method: "DELETE"
        });

        window.location.replace("/");
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete room.");
      }
    });

    const formUpdateRoom = document.getElementById("formUpdateRoom");

    formUpdateRoom.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const location = document.getElementById("location").value;

      const updatedRoom = {
        name,
        location
      };

      try {
        await fetch(`/api/rooms/${room.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedRoom)
        });

        window.location.reload();
      } catch (e) {
        alert("Failed to create new room.");
      }
    });
  } catch (e) {
    console.log(e);
  }
});
