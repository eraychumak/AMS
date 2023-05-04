const params = new URLSearchParams(window.location.search);

const academicYearID = params.get("id");

if (academicYearID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const req = await fetch(`/api/academics?id=${academicYearID}`);

    if (req.status !== 200) {
      return;
    }

    const academic = (await req.json())[0];

    if (!academic) {
      window.location.replace("/");
    }

    const htmlElements = document.getElementsByClassName("useAcademicFullName");

    document.title = `AMS - ${academic.fullName}`;

    // selects all classes that want to show full name.
    for (const htmlElement of htmlElements) {
      if (htmlElement.tagName === "INPUT") {
        htmlElement.value = academic.fullName;
        continue;
      }

      htmlElement.textContent = academic.fullName;
    }

    const htmlDelAcademic = document.getElementById("delAcademic");
    htmlDelAcademic.innerText = `Delete '${academic.fullName}' academic`;

    htmlDelAcademic.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The academic was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/academics/${academic.id}`, {
          method: "DELETE"
        });

        window.location.replace("/");
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete academic.");
      }
    });

    const formUpdateAcademic = document.getElementById("formUpdateAcademic");

    formUpdateAcademic.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;

      if (fullName.split(" ").length === 1) {
        alert("Seems like you only entered a first name, please enter your full name.");
        return;
      }

      const updatedAcademic = {
        fullName
      };

      try {
        await fetch(`/api/academics/${academic.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAcademic)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to update academic.");
      }
    });
  } catch (e) {
    console.log(e);
  }

});
