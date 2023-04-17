const params = new URLSearchParams(window.location.search);

const assessmentID = params.get("assessmentID");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (assessmentID === null || moduleID === null || degreeProgrammeID === null) {
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

    htmlA.href = `../../../../?id=${degreeProgrammeID}`;
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

    htmlA.href = `../../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
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

    htmlA.href = `../../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = assessment.title;
  } catch (e) {
    console.log(e);
    // TODO
  }
}

async function fetchAllAcademicYears() {
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

      htmlOption.value = academicYear.id;
      htmlOption.appendChild(htmlTxt);

      htmlAcademicYearsList.appendChild(htmlOption);
    });
  } catch (e) {
    console.log(e);
    // TODO
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();
  fetchAllAcademicYears();

  const formNewSubmissionDate = document.getElementById("formNewSubmissionDate");

  formNewSubmissionDate.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const deadline = new Date(document.getElementById("deadline").value).toISOString();
    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    const academicYearID = htmlAcademicYearsList.options[htmlAcademicYearsList.options.selectedIndex].value;;

    const newSubmissionDate = {
      name,
      deadline,
      academicYearID
    };

    try {
      const reqPost = await fetch("/api/submissionDates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSubmissionDate)
      });

      if (reqPost.status !== 201) {
        return;
      }

      const submissionDate = await reqPost.json();

      const reqAssessment = await fetch(`/api/assessments?id=${assessmentID}`)

      if (reqAssessment.status !== 200) {
        return;
      }

      const assessment = (await reqAssessment.json())[0];

      const updatedAssessment = {
        ...assessment,
        submissionDateIDs: [
          ...assessment.submissionDateIDs,
          submissionDate.id
        ]
      }

      await fetch(`/api/assessments/${assessmentID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedAssessment)
      });

      window.location.replace(`../../?id=${assessmentID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new submission date.");
    }
  });
});
