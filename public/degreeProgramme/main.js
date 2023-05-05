import { ExitAward } from "../libs/ExitAward.js";
import { DegreeProgramme } from "/libs/DegreeProgramme.js";
import { Mod } from "../libs/Module.js";

const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("id");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

/**
 * Fetch all exit awards and add a marked checkbox and navigational button for the ones that the degree programme owns.
 * @param {DegreeProgramme} degreeProgramme - the degree programme.
 * @returns {Promise<void>}
 */
async function fetchExitAwards(degreeProgramme) {
  const htmlExitAwards = document.getElementById("exitAwardsList");
  const htmlDegreeProgrammeExitAwardsList = document.getElementById("degreeProgrammeExitAwardsList");

  try {
    const exitAwards = await ExitAward.getAll();

    if (exitAwards.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlExitAwards.appendChild(htmlP);
      return;
    }

    exitAwards.forEach(exitAward => {
      if (degreeProgramme.exitAwardIDs.includes(exitAward.id)) {
        htmlDegreeProgrammeExitAwardsList.appendChild(
          htmlSecondaryBtn(
            exitAward.name,
            `./exitAward?id=${exitAward.id}&degreeProgrammeID=${degreeProgrammeID}`
          )
        )
      }

      const checked = degreeProgramme.exitAwardIDs.includes(exitAward.id);
      const container = exitAward.htmlCheckbox(checked);

      htmlExitAwards.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

/**
 * Fetch all modules and add a marked checkbox and navigational button for the ones that the degree programme owns.
 * @param {DegreeProgramme} degreeProgramme - the degree programme.
 * @returns {Promise<void>}
 */
async function fetchModules(degreeProgramme) {
  const htmlModulesList = document.getElementById("modulesList");
  const htmlDegreeProgrammeModulesList = document.getElementById("degreeProgrammeModulesList");

  try {
    const modules = await Mod.getAll();

    if (modules.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlModulesList.appendChild(htmlP);
      return;
    }

    modules.forEach(mod => {
      if (degreeProgramme.moduleIDs.includes(mod.id)) {
        const html = htmlSecondaryBtn(mod.name, `./module?id=${mod.id}&degreeProgrammeID=${degreeProgrammeID}`);
        htmlDegreeProgrammeModulesList.appendChild(html);
      }

      const container = mod.htmlCheckbox(degreeProgramme.moduleIDs.includes(mod.id));
      htmlModulesList.append(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", async () => {
  const htmlCreateNewModule = document.getElementById("createNewModule");
  htmlCreateNewModule.href = `./module/new?degreeProgrammeID=${degreeProgrammeID}`;

  const htmlCreateNewExitAward = document.getElementById("createNewExitAward");
  htmlCreateNewExitAward.href = `./exitAward/new?degreeProgrammeID=${degreeProgrammeID}`;

  try {
    // ? FETCH DEGREE PROGRAMME DETAILS - START
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);
    document.title = `AMS - ${degreeProgramme.name}`;

    updateHTMLHooks("useDegreeProgrammeName", degreeProgramme.name);
    updateHTMLHooks("useDegreeProgrammeLearningOutcomes", degreeProgramme.learningOutcomes);

    fetchModules(degreeProgramme);
    fetchExitAwards(degreeProgramme);
    // ? FETCH DEGREE PROGRAMME DETAILS - END

    // ? UPDATE DEGREE PROGRAMME LOGIC - START
    const formUpdateDegreeProgramme = document.getElementById("formUpdateDegreeProgramme");

    formUpdateDegreeProgramme.addEventListener("submit", async (e) => {
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
        const updateStatus = await degreeProgramme.update(name, learningOutcomes, moduleIDs, exitAwardIDs);

        if (updateStatus) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE DEGREE PROGRAMME LOGIC - END

    // ? DELETE DEGREE PROGRAMME LOGIC - START
    const htmlDelDegreeProgramme = document.getElementById("delDegreeProgramme");
    htmlDelDegreeProgramme.innerText = `Delete '${degreeProgramme.name}' degree programme`;

    htmlDelDegreeProgramme.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The degree programme was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const delStatus = await degreeProgramme.delete();

        if (delStatus) {
          window.location.replace("/");
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE DEGREE PROGRAMME LOGIC - END
  } catch (e) {
    alert(e.msg);
    window.location.replace("/");
  }
});
