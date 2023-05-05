import { AcademicYear } from "../../../../libs/AcademicYear.js";
import { Assessment } from "../../../../libs/Assessment.js";
import { DegreeProgramme } from "../../../../libs/DegreeProgramme.js";
import { Mod } from "../../../../libs/Module.js";
import { SubmissionDate } from "../../../../libs/SubmissionDate.js";

const params = new URLSearchParams(window.location.search);

const submissionDateID = params.get("id");
const assessmentID = params.get("assessmentID");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (submissionDateID === null || assessmentID === null || moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../../?id=${degreeProgrammeID}`;
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

    htmlA.href = `../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    alert(e.msg);
  }

  try {
    const assessment = await Assessment.get(assessmentID);

    if (!assessment) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("assessmentBreadCrumb");

    htmlA.href = `../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = assessment.title;
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAllAcademicYears(submissionDate) {
  try {
    const academicYears = await AcademicYear.getAll();

    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    academicYears.forEach(academicYear => {
      const option = academicYear.htmlOption(academicYear.id === submissionDate.academicYearID);
      htmlAcademicYearsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const submissionDate = await SubmissionDate.get(submissionDateID);

    if (!submissionDate) {
      window.location.replace("/");
    }

    document.title = `AMS - ${submissionDate.name}`;

    fetchAllAcademicYears(submissionDate);

    updateHTMLHooks("useSubmissionDateName", submissionDate.name);
    updateHTMLHooks("useSubmissionDateDeadline", submissionDate.deadline.split("T")[0]);

    // ? DELETE SUBMISSION DATE LOGIC - START
    const htmlDelSubmissionDate = document.getElementById("delSubmissionDate");
    htmlDelSubmissionDate.innerText = `Delete '${submissionDate.name}' submissionDate`;

    htmlDelSubmissionDate.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The submission date was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const delStatus = await submissionDate.delete();

        if (delStatus) {
          window.location.replace(`../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE SUBMISSION DATE LOGIC - END

    // ? UPDATE SUBMISSION DATE LOGIC - START
    const formUpdateSubmissionDate = document.getElementById("formUpdateSubmissionDate");

    formUpdateSubmissionDate.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const deadline = new Date(document.getElementById("deadline").value).toISOString();
      const htmlAcademicYearsList = document.getElementById("academicYearsList");

      const academicYearID = parseInt(htmlAcademicYearsList.options[htmlAcademicYearsList.options.selectedIndex].value);

      try {
        const updateStatus = await submissionDate.update(name, academicYearID, deadline);

        if (updateStatus) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE SUBMISSION DATE - END
  } catch(e) {
    alert(e.msg);
  }
});
