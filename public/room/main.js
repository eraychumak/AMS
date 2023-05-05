import { Room } from "../libs/Room.js";

const params = new URLSearchParams(window.location.search);

const roomID = params.get("id");

if (roomID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const room = await Room.get(roomID);

    if (!room) {
      window.location.replace("/");
    }

    document.title = `AMS - ${room.name}`;

    updateHTMLHooks("useRoomName", room.name);
    updateHTMLHooks("useRoomLocation", room.location);

    // ? DELETE ROOM LOGIC - START
    const htmlDelRoom = document.getElementById("delRoom");
    htmlDelRoom.innerText = `Delete '${room.name}' room`;

    htmlDelRoom.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("The following will also be deleted with the room:\n - Timeslots created for a module that use this room\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The room was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const deleteStatus = await room.delete();

        if (deleteStatus) {
          window.location.replace("/");
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE ROOM LOGIC - END

    // ? UPDATE ROOM LOGIC - START
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
        const statusUpdate = await room.update(name, location);

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
      // ? UPDATE ROOM LOGIC - END
    });
  } catch (e) {
    alert(e.msg);
  }
});
