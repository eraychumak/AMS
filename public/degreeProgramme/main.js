const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("id");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

async function fetchExitAwards(degreeProgrammeExitAwardIDs) {
  const htmlExitAwards = document.getElementById("exitAwardsList");
  const htmlDegreeProgrammeExitAwardsList = document.getElementById("degreeProgrammeExitAwardsList");

  try {
    const reqExitAwards = await fetch("/api/exitAwards");

    if (reqExitAwards.status !== 200) {
      return;
    }

    const exitAwards = await reqExitAwards.json();

    if (exitAwards.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlExitAwards.appendChild(htmlP);
      return;
    }

    exitAwards.forEach(exitAward => {
      if (degreeProgrammeExitAwardIDs.includes(exitAward.id)) {
        htmlDegreeProgrammeExitAwardsList.appendChild(
          htmlSecondaryBtn(
            exitAward.name,
            `./exitAward?id=${exitAward.id}&degreeProgrammeID=${degreeProgrammeID}`
          )
        )
      }

      const htmlDiv = document.createElement("div");
      const htmlInput = document.createElement("input");
      const htmlLabel = document.createElement("label");
      const htmlLabelText = document.createTextNode(exitAward.name);

      htmlDiv.classList.add("checkboxField");

      htmlInput.type = "checkbox";
      htmlInput.id = exitAward.id;
      htmlInput.name = exitAward.id;
      htmlInput.checked = degreeProgrammeExitAwardIDs.includes(exitAward.id);

      htmlLabel.htmlFor = exitAward.id;
      htmlLabel.appendChild(htmlLabelText);

      htmlDiv.appendChild(htmlInput);
      htmlDiv.appendChild(htmlLabel);

      htmlExitAwards.appendChild(htmlDiv);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

window.addEventListener("load", async () => {
  const htmlCreateNewModule = document.getElementById("createNewModule");
  htmlCreateNewModule.href = `./module/new?degreeProgrammeID=${degreeProgrammeID}`;

  const htmlCreateNewExitAward = document.getElementById("createNewExitAward");
  htmlCreateNewExitAward.href = `./exitAward/new?degreeProgrammeID=${degreeProgrammeID}`;

  try {
    const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (reqDegreeProgramme.status !== 200) {
      return;
    }

    const degreeProgramme = (await reqDegreeProgramme.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useDegreeProgrammeName");

    document.title = `AMS - ${degreeProgramme.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = degreeProgramme.name;
        continue;
      }

      htmlNameElement.textContent = degreeProgramme.name;
    }

    const htmlLearningOutcomes = document.getElementById("learningOutcomes");
    htmlLearningOutcomes.value = degreeProgramme.learningOutcomes;

    const htmlDelDegreeProgramme = document.getElementById("delDegreeProgramme");
    htmlDelDegreeProgramme.innerText = `Delete '${degreeProgramme.name}' degree programme`;

    htmlDelDegreeProgramme.addEventListener("click", async (e) => {
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        e.preventDefault();
        alert("The degree programme was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/degreeProgrammes/${degreeProgramme.id}`, {
          method: "DELETE"
        });
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete degree programme.");
      }
    });

    const htmlModulesList = document.getElementById("modulesList");
    const htmlDegreeProgrammeModulesList = document.getElementById("degreeProgrammeModulesList");

    try {
      const reqModules = await fetch("/api/modules");

      if (reqModules.status !== 200) {
        return;
      }

      const modules = await reqModules.json();

      if (modules.length === 0) {
        const htmlP = document.createElement("p");
        const htmlTxt = document.createTextNode("Empty");

        htmlP.appendChild(htmlTxt);
        htmlModulesList.appendChild(htmlP);
        return;
      }

      modules.forEach(mod => {
        const htmlDiv = document.createElement("div");
        const htmlInput = document.createElement("input");
        const htmlLabel = document.createElement("label");
        const htmlLabelText = document.createTextNode(mod.name);

        htmlDiv.classList.add("checkboxField");

        htmlInput.type = "checkbox";
        htmlInput.id = mod.id;
        htmlInput.name = mod.id;
        htmlInput.checked = degreeProgramme.moduleIDs.includes(mod.id);

        if (degreeProgramme.moduleIDs.includes(mod.id)) {
          const html = htmlSecondaryBtn(mod.name, `./module?id=${mod.id}&degreeProgrammeID=${degreeProgrammeID}`);
          htmlDegreeProgrammeModulesList.appendChild(html);
        }

        htmlLabel.htmlFor = mod.id;
        htmlLabel.appendChild(htmlLabelText);

        htmlDiv.appendChild(htmlInput);
        htmlDiv.appendChild(htmlLabel);

        htmlModulesList.appendChild(htmlDiv);
      });
    } catch (e) {
      // TODO
      console.log(e);
    }

    fetchExitAwards(degreeProgramme.exitAwardIDs);

    const formUpdateDegreeProgramme = document.getElementById("formUpdateDegreeProgramme");

    formUpdateDegreeProgramme.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const learningOutcomes = document.getElementById("learningOutcomes").value;

      const selectedModules = document.querySelectorAll("#modulesList input[type=checkbox]:checked");
      const moduleIDs = [];

      selectedModules.forEach(mod => {
        if (mod.checked) {
          moduleIDs.push(parseInt(mod.id));
        }
      });

      const selectedExitAwards = document.querySelectorAll("#exitAwardsList input[type=checkbox]:checked");
      const exitAwardIDs = [];

      selectedExitAwards.forEach(exitAward => {
        if (mod.checked) {
          exitAwardIDs.push(parseInt(exitAward.id));
        }
      });

      const updatedDegreeProgramme = {
        name,
        learningOutcomes,
        moduleIDs,
        exitAwardIDs
      };

      try {
        await fetch(`/api/degreeProgrammes/${degreeProgrammeID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedDegreeProgramme)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to update degree programme.");
      }
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
});
