import { AcademicYear } from "../../libs/AcademicYear.js";

window.addEventListener("load", () => {
  const formNewAcademicYear = document.getElementById("formNewAcademicYear");

  formNewAcademicYear.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    try {
      const statusCreate = await AcademicYear.create(name);

      if (statusCreate) {
        window.location.replace("/");
      }
    } catch (e) {
      alert(e.msg);
    }
  });
});
