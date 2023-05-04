const params = new URLSearchParams(window.location.search);

const assessmentID = params.get("id");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (assessmentID === null || moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function fetchAllAcademicYears(assessmentSubmissionDateIDs) {
  const htmlAcademicYearsList = document.getElementById("academicYearsList");

  try {
    const reqAcademicYears = await fetch("/api/academicYears");

    if (reqAcademicYears.status !== 200) {
      return;
    }

    const academicYears = await reqAcademicYears.json();

    academicYears.forEach(async (academicYear) => {
      const htmlFormFieldAcademicYear = document.createElement("section");
      htmlFormFieldAcademicYear.classList.add("formField");

      const htmlLabelAcademicYear = document.createElement("label");
      const htmlTxtAcademicYear = document.createTextNode(academicYear.name);
      htmlLabelAcademicYear.appendChild(htmlTxtAcademicYear);

      htmlFormFieldAcademicYear.appendChild(htmlLabelAcademicYear);

      const htmlSelectSubmissionDatesList = document.createElement("select");
      htmlSelectSubmissionDatesList.name = `submissionDatesList-${academicYear.id}`;
      htmlSelectSubmissionDatesList.id = `submissionDatesList-${academicYear.id}`;

      const htmlOptionNone = document.createElement("option");
      const htmlTxtNone = document.createTextNode("None");

      htmlOptionNone.appendChild(htmlTxtNone);

      htmlOptionNone.value = "";
      htmlSelectSubmissionDatesList.appendChild(htmlOptionNone);

      try {
        const reqSubmissionDates = await fetch(`/api/submissionDates?academicYearID=${academicYear.id}`);

        if (reqSubmissionDates.status !== 200) {
          return;
        }

        const submissionDates = await reqSubmissionDates.json();

        submissionDates.forEach(submissionDate => {
          const htmlOption = document.createElement("option");
          const htmlTxt = document.createTextNode(`${submissionDate.name} (${new Date(submissionDate.deadline).toDateString()})`);

          htmlOption.appendChild(htmlTxt);

          htmlOption.value = submissionDate.id;
          htmlOption.selected = assessmentSubmissionDateIDs.includes(submissionDate.id);
          htmlSelectSubmissionDatesList.appendChild(htmlOption);
        });

        htmlAcademicYearsList.appendChild(htmlFormFieldAcademicYear);
        htmlAcademicYearsList.appendChild(htmlSelectSubmissionDatesList);
      } catch (e) {
        console.log(e);
        // TODO
      }
    });
  } catch (e) {
    console.log(e);
    // TODO
  }
}

async function fetchSubmissionDates(assessmentSubmissionDatesIDs) {
  const htmlAssessmentSubmissionDatesList = document.getElementById("assessmentSubmissionDatesList");

  assessmentSubmissionDatesIDs.forEach(async (assessmentSubmissionDateID) => {
    try {
      const reqSubmissionDate = await fetch(`/api/submissionDates?id=${assessmentSubmissionDateID}`);

      if (reqSubmissionDate.status !== 200) {
        return;
      }

      const submissionDate = (await reqSubmissionDate.json())[0];

      try {
        const reqAcademicYear = await fetch(`/api/academicYears?id=${submissionDate.academicYearID}`);

        if (reqAcademicYear.status !== 200) {
          return;
        }

        const academicYear = (await reqAcademicYear.json())[0];

        htmlAssessmentSubmissionDatesList.appendChild(
          htmlSecondaryBtn(
            `${submissionDate.name} (${academicYear.name})`,
            `./submissionDate?id=${submissionDate.id}&assessmentID=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`
          )
        );
      } catch (e) {
        console.log(e);
        // TODO
      }
    } catch (e) {
      console.log(e);
      // TODO
    }
  });
}

async function updateBreadCrumbs() {
  try {
    const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (reqDegreeProgramme.status !== 200) {
      return;
    }

    const degreeProgramme = (await reqDegreeProgramme.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {

  }

  try {
    const reqModule = await fetch(`/api/modules?id=${moduleID}`);

    if (reqModule.status !== 200) {
      return;
    }

    const mod = (await reqModule.json())[0];

    if (!mod) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("moduleBreadCrumb");

    htmlA.href = `../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    console.log(e);
    // TODO
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  const htmlCreateNewSubmissionDate = document.getElementById("createNewSubmissionDate");
  htmlCreateNewSubmissionDate.href = `./submissionDate/new?assessmentID=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;

  try {
    const reqAssessment = await fetch(`/api/assessments?id=${assessmentID}`);

    if (reqAssessment.status !== 200) {
      return;
    }

    const assessment = (await reqAssessment.json())[0];

    if (!assessment) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useAssessmentTitle");

    document.title = `AMS - ${assessment.title}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = assessment.title;
        continue;
      }

      htmlNameElement.textContent = assessment.title;
    }

    const htmlLearningOutcomes = document.getElementById("learningOutcomes");
    htmlLearningOutcomes.value = assessment.learningOutcomes;

    const htmlWeight = document.getElementById("weight");
    htmlWeight.value = assessment.weight * 100;

    const htmlNumber = document.getElementById("number");
    htmlNumber.value = assessment.number;

    const htmlVolume = document.getElementById("volume");
    htmlVolume.value = assessment.volume;

    fetchAllAcademicYears(assessment.submissionDateIDs);
    fetchSubmissionDates(assessment.submissionDateIDs);

    const htmlDelModule = document.getElementById("delAssessment");
    htmlDelModule.innerText = `Delete '${assessment.title}' assessment`;

    htmlDelModule.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The assessment was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/assessments/${assessment.id}`, {
          method: "DELETE"
        });

        const reqModules = await fetch("/api/modules");

        if (reqModules.status !== 200) {
          return;
        }

        const modules = await reqModules.json();

        modules.forEach(async (mod) => {
          if (!mod.assessmentIDs.includes(assessment.id)) {
            return;
          }

          const updatedAssessmentIDs = mod.assessmentIDs.filter(assessmentID => assessment.id !== assessmentID);

          const updatedModule = {
            ...mod,
            assessmentIDs: updatedAssessmentIDs
          };

          try {
            await fetch(`/api/modules/${mod.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedModule)
            });

            window.location.replace("/");
          } catch (e) {
            console.log(e);
            // TODO
          }
        });

        window.location.replace(`../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete assessment.");
      }
    });

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

      const updatedAssessment = {
        title,
        learningOutcomes,
        weight,
        number,
        volume,
        submissionDateIDs: selectedSubmissionDateIDs
      };

      try {
        await fetch(`/api/assessments/${assessmentID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAssessment)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to update assessment.");
      }
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
});
