import { Academic } from "../libs/Academic.js";

const params = new URLSearchParams(window.location.search);

const academicID = params.get("id");

if (academicID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const academic = await Academic.get(academicID);

    if (!academic) {
      window.location.replace("/");
    }

    document.title = `AMS - ${academic.fullName}`;

    updateHTMLHooks("useAcademicFullName", academic.fullName);

    // ? DELETE ACADEMIC LOGIC - START
    const htmlDelAcademic = document.getElementById("delAcademic");
    htmlDelAcademic.innerText = `Delete '${academic.fullName}' academic`;

    htmlDelAcademic.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("The following will also be deleted with the academic:\n - Timeslots created for a module that use this academic\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The academic was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const deleteStatus = await academic.delete();

        if (deleteStatus) {
          window.location.replace("/");
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE ACADEMIC LOGIC - END

    // ? UPDATE ACADEMIC LOGIC - START
    const formUpdateAcademic = document.getElementById("formUpdateAcademic");

    formUpdateAcademic.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;

      if (fullName.split(" ").length === 1) {
        alert("Seems like you only entered a first name, please enter your full name.");
        return;
      }

      try {
        const statusUpdate = await academic.update(fullName);

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE ACADEMIC LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
