async function fetchExitAwards() {
  const htmlExitAwards = document.getElementById("exitAwardsList");

  try {
    const reqExitAwards = await fetch("/api/exitAwards");

    if (reqExitAwards.status !== 200) {
      return;
    }

    const exitAwards = await reqExitAwards.json();

    if (exitAwards.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Currently empty, you will be able to create these after creating the degree programme.");

      htmlP.appendChild(htmlTxt);
      htmlExitAwards.appendChild(htmlP);
      return;
    }

    exitAwards.forEach(exitAward => {
      const htmlDiv = document.createElement("div");
      const htmlInput = document.createElement("input");
      const htmlLabel = document.createElement("label");
      const htmlLabelText = document.createTextNode(exitAward.name);

      htmlDiv.classList.add("checkboxField");

      htmlInput.type = "checkbox";
      htmlInput.id = exitAward.id;
      htmlInput.name = exitAward.id;

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
  try {
    const htmlModulesList = document.getElementById("modulesList");

    try {
      const reqModules = await fetch("/api/modules");

      if (reqModules.status !== 200) {
        return;
      }

      const modules = await reqModules.json();

      if (modules.length === 0) {
        const htmlP = document.createElement("p");
        const htmlTxt = document.createTextNode("Currently empty, you will be able to create these after creating the degree programme.");

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

    fetchExitAwards();

    const formNewDegreeProgramme = document.getElementById("formNewDegreeProgramme");

    formNewDegreeProgramme.addEventListener("submit", async (e) => {
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

      const newDegreeProgramme = {
        name,
        learningOutcomes,
        moduleIDs,
        exitAwardIDs
      };

      try {
        const reqDegreeProgramme = await fetch(`/api/degreeProgrammes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newDegreeProgramme)
        });

        if (reqDegreeProgramme.status !== 201) {
          return;
        }

        const degreeProgramme = await reqDegreeProgramme.json();

        window.location.replace(`/degreeProgramme?id=${degreeProgramme.id}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to create new degree programme.");
      }
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
});
