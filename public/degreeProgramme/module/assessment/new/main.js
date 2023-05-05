import { Assessment } from "../../../../libs/Assessment.js";
import { DegreeProgramme } from "../../../../libs/DegreeProgramme.js";
import { Mod } from "../../../../libs/Module.js";

const params = new URLSearchParams(window.location.search);

const moduleID = params.get("moduleID");
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
}

window.addEventListener("load", () => {
  updateBreadCrumbs();

  // ? FORM NEW ASSESSMENT LOGIC - START
  const formNewAssessment = document.getElementById("formNewAssessment");

  formNewAssessment.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const learningOutcomes = document.getElementById("learningOutcomes").value;
    const weight = parseFloat(document.getElementById("weight").value) / 100;
    const number = parseInt(document.getElementById("number").value);
    const volume = parseInt(document.getElementById("volume").value);

    try {
      const statusCreate = await Assessment.create(
        title, number, learningOutcomes, volume, weight, [], moduleID
      );

      if (statusCreate) {
        window.location.replace(`../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      }
    } catch(e) {
      alert(e.msg);
    }
    // ? FORM NEW ASSESSMENT LOGIC - END
  });
});
