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
    const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (reqDegreeProgramme.status !== 200) {
      return;
    }

    const degreeProgramme = (await reqDegreeProgramme.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    console.log(e);
    // TODO
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

    htmlA.href = `../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    console.log(e);
    // TODO
  }

  try {
    const reqAssessment = await fetch(`/api/assessments?id=${assessmentID}`);

    if (reqAssessment.status !== 200) {
      return;
    }

    const assessment = (await reqAssessment.json())[0];

    if (!assessment) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("assessmentBreadCrumb");

    htmlA.href = `../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = assessment.title;
  } catch (e) {
    console.log(e);
    // TODO
  }
}

async function fetchAllAcademicYears(currentAcademicYearID) {
  try {
    const req = await fetch("/api/academicYears");

    if (req.status !== 200) {
      return;
    }

    const academicYears = await req.json();

    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    academicYears.forEach(academicYear => {
      const htmlOption = document.createElement("option");
      const htmlTxt = document.createTextNode(academicYear.name);

      if (academicYear.id === currentAcademicYearID) {
        htmlOption.selected = true;
      }

      htmlOption.value = academicYear.id;
      htmlOption.appendChild(htmlTxt);

      htmlAcademicYearsList.appendChild(htmlOption);
    });
  } catch (e) {
    console.log(e);
    // TODO
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const req = await fetch(`/api/submissionDates?id=${submissionDateID}`);

    if (req.status !== 200) {
      return;
    }

    const submissionDate = (await req.json())[0];

    if (!submissionDate) {
      window.location.replace("/");
    }

    fetchAllAcademicYears(submissionDate.academicYearID);

    const htmlNameElements = document.getElementsByClassName("useSubmissionDateName");

    document.title = `AMS - ${submissionDate.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = submissionDate.name;
        continue;
      }

      htmlNameElement.textContent = submissionDate.name;
    }

    const htmlDeadline = document.getElementById("deadline");
    htmlDeadline.value = submissionDate.deadline.split("T")[0];

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
        await fetch(`/api/submissionDates/${submissionDate.id}`, {
          method: "DELETE"
        });

        const reqAssessments = await fetch("/api/assessments");

        if (reqAssessments.status !== 200) {
          return;
        }

        const assessments = await reqAssessments.json();

        assessments.forEach(async (assessment) => {
          if (!assessment.submissionDateIDs.includes(submissionDate.id)) {
            return;
          }

          const updatedSubmissionDateIDs = assessment.submissionDateIDs.filter(subDateID => submissionDate.id !== subDateID);

          const updatedAssessment = {
            ...assessment,
            submissionDateIDs: updatedSubmissionDateIDs
          };

          try {
            await fetch(`/api/assessments/${assessment.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedAssessment)
            });
          } catch (e) {
            console.log(e);
            // TODO
          }
        });

        window.location.replace(`../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete assessment.");
      }
    });
  } catch (e) {
    console.log(e);
    // TODO
  }

  const formUpdateSubmissionDate = document.getElementById("formUpdateSubmissionDate");

  formUpdateSubmissionDate.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const deadline = new Date(document.getElementById("deadline").value).toISOString();
    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    const academicYearID = parseInt(htmlAcademicYearsList.options[htmlAcademicYearsList.options.selectedIndex].value);

    const updatedSubmissionDate = {
      name,
      deadline,
      academicYearID
    };

    try {
      await fetch(`/api/submissionDates/${submissionDateID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSubmissionDate)
      });

      window.location.replace(`../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new submission date.");
    }
  });
});
