const params = new URLSearchParams(window.location.search);

const exitAwardID = params.get("id");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (exitAwardID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (reqDegreeProgramme.status !== 200) {
      return;
    }

    const degreeProgramme = (await reqDegreeProgramme.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {

  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const reqExitAward = await fetch(`/api/exitAwards?id=${exitAwardID}`);

    if (reqExitAward.status !== 200) {
      return;
    }

    const exitAward = (await reqExitAward.json())[0];

    if (!exitAward) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useExitAwardName");

    document.title = `AMS - ${exitAward.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = exitAward.name;
        continue;
      }

      htmlNameElement.textContent = exitAward.name;
    }

    const htmlDelExitAward = document.getElementById("delExitAward");
    htmlDelExitAward.innerText = `Delete '${exitAward.name}' exit award`;

    htmlDelExitAward.addEventListener("click", async (e) => {
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        e.preventDefault();
        alert("The exit award was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/exitAwards/${exitAward.id}`, {
          method: "DELETE"
        });

        const reqDegreeProgrammes = await fetch("/api/degreeProgrammes");

        if (reqDegreeProgrammes.status !== 200) {
          return;
        }

        const degreeProgrammes = await reqDegreeProgrammes.json();

        degreeProgrammes.forEach(async (degreeProgramme) => {
          if (!degreeProgramme.exitAwardIDs.includes(exitAward.id)) {
            return;
          }

          const updatedExitAwardIDs = degreeProgramme.exitAwardIDs.filter(exitAwardID => exitAward.id !== exitAwardID);

          const updatedDegreeProgramme = {
            ...degreeProgramme,
            exitAwardIDs: updatedExitAwardIDs
          };

          try {
            await fetch(`/api/degreeProgrammes/${degreeProgramme.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedDegreeProgramme)
            });
          } catch (e) {
            console.log(e);
            // TODO
          }
        });

        window.location.replace(`../?id=${degreeProgrammeID}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete exit award.");
      }
    });

    const formUpdateExitAward = document.getElementById("formUpdateExitAward");

    formUpdateExitAward.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;

      const updatedExitAward = {
        name
      };

      try {
        await fetch(`/api/exitAwards/${exitAwardID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedExitAward)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to update exit award.");
      }
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
});
