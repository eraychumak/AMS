import { AcademicYear } from "../../../libs/AcademicYear.js";
import { SubmissionDate } from "../../../libs/SubmissionDate.js";
import { DegreeProgramme } from "../../../libs/DegreeProgramme.js";
import { Mod } from "../../../libs/Module.js";
import { Assessment } from "../../../libs/Assessment.js";

const params = new URLSearchParams(window.location.search);

const assessmentID = params.get("id");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (assessmentID === null || moduleID === null || degreeProgrammeID === null) {
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

  try {
    const mod = await Mod.get(moduleID);

    if (!mod) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("moduleBreadCrumb");

    htmlA.href = `../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    alert(e.msg);
  }
}

/**
 * Fetch all academic years.
 * @param {Assessment} assessment - assessment.
 */
async function fetchAllAcademicYears(assessment) {
  const htmlAcademicYearsList = document.getElementById("academicYearsList");
  const htmlAssessmentSubmissionDatesList = document.getElementById("assessmentSubmissionDatesList");

  try {
    const academicYears = await AcademicYear.getAll();

    academicYears.forEach(async (academicYear) => {
      const [htmlFormFieldAcademicYear, htmlSelectSubmissionDatesList] = (
        academicYear.htmlDropdownSection()
      );

      try {
        const submissionDates = await SubmissionDate.getAll({
          academicYearID: academicYear.id
        });

        submissionDates.forEach(submissionDate => {

          if (assessment.submissionDateIDs.includes(submissionDate.id)) {
            htmlAssessmentSubmissionDatesList.appendChild(
              htmlSecondaryBtn(
                `${submissionDate.name} (${academicYear.name})`,
                `./submissionDate?id=${submissionDate.id}&assessmentID=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`
              )
            );
          }

          const option = submissionDate.htmlOption(assessment.submissionDateIDs.includes(submissionDate.id));
          htmlSelectSubmissionDatesList.appendChild(option);
        });

        htmlAcademicYearsList.appendChild(htmlFormFieldAcademicYear);
        htmlAcademicYearsList.appendChild(htmlSelectSubmissionDatesList);
      } catch (e) {
        alert(e.msg);
      }
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  const htmlCreateNewSubmissionDate = document.getElementById("createNewSubmissionDate");
  htmlCreateNewSubmissionDate.href = `./submissionDate/new?assessmentID=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;

  try {
    const assessment = await Assessment.get(assessmentID);

    if (!assessment) {
      window.location.replace("/");
    }

    document.title = `AMS - ${assessment.title}`;

    fetchAllAcademicYears(assessment);

    updateHTMLHooks("useAssessmentTitle", assessment.title);
    updateHTMLHooks("useAssessmentLearningOutcomes", assessment.learningOutcomes);
    updateHTMLHooks("useAssessmentWeight", assessment.weight * 100);
    updateHTMLHooks("useAssessmentNumber", assessment.number);
    updateHTMLHooks("useAssessmentVolume", assessment.volume);

    // ? DELETE ASSESSMENT LOGIC - START
    const htmlDelModule = document.getElementById("delAssessment");
    htmlDelModule.innerText = `Delete '${assessment.title}' assessment`;

    htmlDelModule.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("Submission dates assigned to the assessment will not be deleted.\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The assessment was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const statusDelete = await assessment.delete();

        if (statusDelete) {
          window.location.replace(`../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE ASSESSMENT LOGIC - END

    // ? UPDATE ASSESSMENT LOGIC - START
    const formUpdateAssessment = document.getElementById("formUpdateAssessment");

    formUpdateAssessment.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const learningOutcomes = document.getElementById("learningOutcomes").value;
      const weight = parseFloat(document.getElementById("weight").value) / 100;
      const number = parseInt(document.getElementById("number").value);
      const volume = parseInt(document.getElementById("volume").value);

      const htmlAcademicYearsList = document.getElementById("academicYearsList");
      const htmlSelects = htmlAcademicYearsList.querySelectorAll("select");

      const selectedSubmissionDateIDs = [];

      for (const htmlSelect of htmlSelects) {
        const submissionDateID = htmlSelect.options[htmlSelect.options.selectedIndex].value;

        if (submissionDateID) {
          selectedSubmissionDateIDs.push(parseInt(submissionDateID));
        }
      }

      try {
        const statusUpdate = await assessment.update(
          title, number, learningOutcomes, volume, weight, selectedSubmissionDateIDs
        );

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE ASSESSMENT LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
