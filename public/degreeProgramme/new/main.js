import { DegreeProgramme } from "../../libs/DegreeProgramme.js";
import { ExitAward } from "../../libs/ExitAward.js";
import { Mod } from "../../libs/Module.js";

/**
 * Fetch all exit awards.
 * @returns {Promise<void>}
 */
async function fetchExitAwards() {
  try {
    const exitAwards = await ExitAward.getAll();
    const htmlExitAwards = document.getElementById("exitAwardsList");

    if (exitAwards.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Currently empty, you will be able to create these after creating the degree programme.");

      htmlP.appendChild(htmlTxt);
      htmlExitAwards.appendChild(htmlP);
      return;
    }

    exitAwards.forEach(exitAward => {
      const container = exitAward.htmlCheckbox();
      htmlExitAwards.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

/**
 * Fetch all modules.
 * @returns {Promise<void>}
 */
async function fetchModules() {
  try {
    const modules = await Mod.getAll();
    const htmlModulesList = document.getElementById("modulesList");

    if (modules.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Currently empty, you will be able to create these after creating the degree programme.");

      htmlP.appendChild(htmlTxt);
      htmlModulesList.appendChild(htmlP);
      return;
    }

    modules.forEach(mod => {
      const container = mod.htmlCheckbox();
      htmlModulesList.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", async () => {
  fetchModules();
  fetchExitAwards();

  // ? CREATE NEW DEGREE PROGRAMME LOGIC - START
  const formNewDegreeProgramme = document.getElementById("formNewDegreeProgramme");

  formNewDegreeProgramme.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const learningOutcomes = document.getElementById("learningOutcomes").value;

    const selectedModules = document.querySelectorAll("#modulesList input[type=checkbox]:checked");
    const moduleIDs = [];

    selectedModules.forEach(mod => {
      if (mod.checked) {
        const modID = mod.id.split("-")[1];
        moduleIDs.push(parseInt(modID));
      }
    });

    const selectedExitAwards = document.querySelectorAll("#exitAwardsList input[type=checkbox]:checked");
    const exitAwardIDs = [];

    selectedExitAwards.forEach(exitAward => {
      if (exitAward.checked) {
        const exitAwardID = exitAward.id.split("-")[1];
        exitAwardIDs.push(parseInt(exitAwardID));
      }
    });

    try {
      const degreeProgramme = await DegreeProgramme.create(name, learningOutcomes, moduleIDs, exitAwardIDs);

      if (degreeProgramme) {
        window.location.replace(`/degreeProgramme?id=${degreeProgramme.id}`);
      }
    } catch (e) {
      alert(e.msg);
    }
  });
  // ? CREATE NEW DEGREE PROGRAMME LOGIC - END
});
