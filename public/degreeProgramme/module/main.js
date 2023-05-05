import { Assessment } from "../../libs/Assessment.js";
import { DegreeProgramme } from "../../libs/DegreeProgramme.js";
import { Mod } from "../../libs/Module.js";
import { TimeSlot } from "../../libs/TimeSlot.js";

const params = new URLSearchParams(window.location.search);

const moduleID = params.get("id");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    alert(e.msg);
  }
}

/**
 * Get all assessments
 * @param {Mod} mod - the module
 * @returns {void}
 */
async function fetchAllAssessments(mod) {
  try {
    const assessments = await Assessment.getAll();

    const htmlAssessmentsList = document.getElementById("assessmentsList");
    const htmlModuleAssessmentsList = document.getElementById("moduleAssessmentsList");

    if (assessments.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAssessmentsList.appendChild(htmlP);
      return;
    }

    const totalAssessmentsWeight = mod.getTotalAssessmentsWeight(assessments);
    updateHTMLHooks("useTotalAssessmentsWeight", totalAssessmentsWeight[0]);

    if (Math.round(totalAssessmentsWeight[1]) > 1) {
      const htmlCreateNewAssessment = document.getElementById("createNewAssessment");
      htmlCreateNewAssessment.href = "#";
      htmlCreateNewAssessment.onclick = (e) => {
        e.preventDefault();

        alert("The weighting of all module assessments cannot go over 100%.\n\nYou may remove an assessment or reduce an assessment's weight to create another one.")
      };
    }

    assessments.forEach(assessment => {
      if (mod.assessmentIDs.includes(assessment.id)) {
        const html = htmlSecondaryBtn(`CIS${assessment.number} - ${assessment.title}`, `./assessment?id=${assessment.id}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
        htmlModuleAssessmentsList.appendChild(html);
      }

      const container = assessment.htmlCheckbox(
        mod.assessmentIDs.includes(assessment.id)
      );

      htmlAssessmentsList.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchTimeslots(mod) {
  const htmlModuleTimeslotList = document.getElementById("moduleTimeslotList");

  try {
    const timeslots = await TimeSlot.getAll({
      moduleID: mod.id
    });

    timeslots.forEach(async timeslot => {
      const container = await timeslot.htmlWidgetContainer(degreeProgrammeID);
      htmlModuleTimeslotList.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    // ? FETCH MODULE DETAILS LOGIC - START
    const mod = await Mod.get(moduleID);

    if (!mod) {
      window.location.replace("/");
      return;
    }

    document.title = `AMS - ${mod.name}`;
    fetchAllAssessments(mod);
    fetchTimeslots(mod);

    updateHTMLHooks("useModuleName", mod.name);
    updateHTMLHooks("useModuleCredits", mod.credits);
    updateHTMLHooks("useModuleHours", mod.hours);
    updateHTMLHooks("useModuleLearningOutcomes", mod.learningOutcomes);

    const htmlCreateNewAssessment = document.getElementById("createNewAssessment");
    htmlCreateNewAssessment.href = `./assessment/new/?moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;

    const htmlCreateNewTimeslot = document.getElementById("createNewTimeslot");
    htmlCreateNewTimeslot.href = `./timeslot/new/?moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    // ? FETCH MODULE DETAILS LOGIC - END

    // ? DELETE MODULE DETAILS LOGIC - START
    const htmlDelModule = document.getElementById("delModule");
    htmlDelModule.innerText = `Delete '${mod.name}' module`;

    htmlDelModule.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("The following will also be deleted with the module:\n - Timeslots created for the module\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The module was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const statusDelete = await mod.delete();

        if (statusDelete) {
          window.location.replace(`../?id=${degreeProgrammeID}`);
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE MODULE DETAILS LOGIC - END

    // ? UPDATE MODULE DETAILS LOGIC - START
    const formUpdateModule = document.getElementById("formUpdateModule");

    formUpdateModule.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const credits = parseInt(document.getElementById("credits").value);
      const hours = parseInt(document.getElementById("hours").value);
      const learningOutcomes = document.getElementById("learningOutcomes").value;

      const selectedAssessments = document.querySelectorAll("#assessmentsList input[type=checkbox]:checked");
      const assessmentIDs = [];
      let totalWeight = 0;

      selectedAssessments.forEach(assessment => {
        if (assessment.checked) {
          assessmentIDs.push(parseInt(assessment.id));
          totalWeight += parseFloat(assessment.dataset.assessementWeight);
        }
      });

      if (Math.round(totalWeight) > 1) {
        alert("Assessment weight cannot be over 100%.");
        return;
      }

      try {
        const statusUpdate = mod.update(name, hours, learningOutcomes, credits, assessmentIDs);

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE MODULE DETAILS LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
