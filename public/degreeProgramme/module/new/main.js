import { Assessment } from "../../../libs/Assessment.js";
import { DegreeProgramme } from "../../../libs/DegreeProgramme.js";
import { Mod } from "../../../libs/Module.js";

const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("degreeProgrammeID");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAllAssessments() {
  const htmlAssessmentsList = document.getElementById("assessmentsList");

  try {
    const assessments = await Assessment.getAll();

    if (assessments.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAssessmentsList.appendChild(htmlP);
      return;
    }

    assessments.forEach(assessment => {
      const container = assessment.htmlCheckbox();
      htmlAssessmentsList.appendChild(container);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();
  fetchAllAssessments();

  // ? CREATE MODULE LOGIC - START
  const formNewModule = document.getElementById("formNewModule");

  formNewModule.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const credits = parseInt(document.getElementById("credits").value);
    const hours = parseInt(document.getElementById("hours").value);
    const learningOutcomes = document.getElementById("learningOutcomes").value;

    const selectedAssessments = document.querySelectorAll("#assessmentsList input[type=checkbox]:checked");
    const assessmentIDs = [];

    selectedAssessments.forEach(assessment => {
      if (assessment.checked) {
        assessmentIDs.push(parseInt(assessment.id));
      }
    });

    try {
      const createStatus = await Mod.create(
        name, credits, hours, learningOutcomes, assessmentIDs, degreeProgrammeID
      );

      if (createStatus) {
        window.location.replace(`../../?id=${degreeProgrammeID}`);
      }
    } catch (e) {
      alert(e.msg);
    }
  });
  // ? CREATE MODULE LOGIC - END
});
