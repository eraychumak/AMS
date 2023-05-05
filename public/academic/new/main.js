import { Academic } from "../../libs/Academic.js";

window.addEventListener("load", () => {
  const formNewAcademic = document.getElementById("formNewAcademic");

  formNewAcademic.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;

    if (fullName.split(" ").length === 1) {
      alert("Seems like you only entered a first name, please enter your full name.");
      return;
    }

    try {
      const statusCreate = Academic.create(fullName);

      if (statusCreate) {
        window.location.replace("/");
      }
    } catch (e) {
      alert(e.msg);
    }
  });
});
