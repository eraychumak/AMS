import { AcademicYear } from "../../../../../libs/AcademicYear.js";
import { Assessment } from "../../../../../libs/Assessment.js";
import { DegreeProgramme } from "../../../../../libs/DegreeProgramme.js";
import { Mod } from "../../../../../libs/Module.js";
import { SubmissionDate } from "../../../../../libs/SubmissionDate.js";

const params = new URLSearchParams(window.location.search);

const assessmentID = params.get("assessmentID");
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

    htmlA.href = `../../../../?id=${degreeProgrammeID}`;
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

    htmlA.href = `../../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
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

    htmlA.href = `../../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = assessment.title;
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAllAcademicYears() {
  try {
    const academicYears = await AcademicYear.getAll();

    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    academicYears.forEach(academicYear => {
      const option = academicYear.htmlOption();
      htmlAcademicYearsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();
  fetchAllAcademicYears();

  // ? NEW SUBMISSION DATE LOGIC - START
  const formNewSubmissionDate = document.getElementById("formNewSubmissionDate");

  formNewSubmissionDate.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const deadline = new Date(document.getElementById("deadline").value).toISOString();
    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    const academicYearID = parseInt(htmlAcademicYearsList.options[htmlAcademicYearsList.options.selectedIndex].value);

    try {
      const statusNew = await SubmissionDate.create(
        name, academicYearID, deadline, assessmentID
      );

      if (statusNew) {
        window.location.replace(`../../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      }
    } catch (e) {
      alert(e.msg);
    }
  });
});
