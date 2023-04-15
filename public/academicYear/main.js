const params = new URLSearchParams(window.location.search);

const academicYearID = params.get("id");

if (academicYearID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const req = await fetch(`/api/academicYears?id=${academicYearID}`);

    if (req.status !== 200) {
      return;
    }

    const academicYear = (await req.json())[0];

    if (!academicYear) {
      window.location.replace("/");
    }

    const htmlElements = document.getElementsByClassName("useAcademicYear");

    document.title = `AMS - ${academicYear.name}`;

    // selects all classes that want to show full name.
    for (const htmlElement of htmlElements) {
      if (htmlElement.tagName === "INPUT") {
        htmlElement.value = academicYear.name;
        continue;
      }

      htmlElement.textContent = academicYear.name;
    }

    const htmlDelAcademic = document.getElementById("delAcademicYear");
    htmlDelAcademic.innerText = `Delete '${academicYear.name}' academic year`;

    htmlDelAcademic.addEventListener("click", async (e) => {
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        e.preventDefault();
        alert("The academic year was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/academicYears/${academicYear.id}`, {
          method: "DELETE"
        });
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete academic year.");
      }
    });

    const formUpdateAcademicYear = document.getElementById("formUpdateAcademicYear");

    formUpdateAcademicYear.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;

      const updatedAcademicYear = {
        name
      };

      try {
        await fetch(`/api/academicYears/${academicYear.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAcademicYear)
        });

        window.location.reload();
      } catch (e) {
        alert("Failed to create new academic year.");
      }
    });
  } catch (e) {
    console.log(e);
  }
});
