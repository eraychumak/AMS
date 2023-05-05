import { AcademicYear } from "../libs/AcademicYear.js";

const params = new URLSearchParams(window.location.search);

const academicYearID = params.get("id");

if (academicYearID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const academicYear = await AcademicYear.get(academicYearID);

    if (!academicYear) {
      window.location.replace("/");
    }

    document.title = `AMS - ${academicYear.name}`;

    updateHTMLHooks("useAcademicYearName", academicYear.name);

    // ? DELETE ACADEMIC YEAR LOGIC - START
    const htmlDelAcademic = document.getElementById("delAcademicYear");
    htmlDelAcademic.innerText = `Delete '${academicYear.name}' academic year`;

    htmlDelAcademic.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("The following will also be deleted with the academic year:\n - Timeslots created for a module that use this academic year\n - Submission dates for each assessment that use this academic year\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The academic year was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const delStats = await academicYear.delete();

        if (delStats) {
          window.location.replace("/");
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE ACADEMIC YEAR LOGIC - END

    // ? UPDATE ACADEMIC YEAR LOGIC - START
    const formUpdateAcademicYear = document.getElementById("formUpdateAcademicYear");

    formUpdateAcademicYear.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;

      try {
        const statusUpdate = await academicYear.update(name);

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE ACADEMIC YEAR LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
