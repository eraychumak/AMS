import { Room } from "../../libs/Room.js";

window.addEventListener("load", () => {
  const formNewRoom = document.getElementById("formNewRoom");

  formNewRoom.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;

    try {
      const statusCreate = await Room.create(name, location);

      if (statusCreate) {
        window.location.replace("/");
      }
    } catch (e) {
      alert(e.msg);
    }
  });
});
