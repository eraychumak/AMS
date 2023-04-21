const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("degreeProgrammeID");

if (degreeProgrammeID === null) {
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

    htmlA.href = `../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    console.log(e);
    // TODO
  }
}

async function fetchAssessments() {
  const htmlAssessmentsList = document.getElementById("assessmentsList");

  try {
    const reqAssessments = await fetch("/api/assessments");

    if (reqAssessments.status !== 200) {
      return;
    }

    const assessments = await reqAssessments.json();

    if (assessments.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAssessmentsList.appendChild(htmlP);
      return;
    }

    assessments.forEach(assessment => {
      const htmlDiv = document.createElement("div");
      const htmlInput = document.createElement("input");
      const htmlLabel = document.createElement("label");
      const htmlLabelText = document.createTextNode(`CIS${assessment.number} - ${assessment.title}`);

      htmlDiv.classList.add("checkboxField");

      htmlInput.type = "checkbox";
      htmlInput.id = assessment.id;
      htmlInput.name = assessment.id;

      htmlLabel.htmlFor = assessment.id;
      htmlLabel.appendChild(htmlLabelText);

      htmlDiv.appendChild(htmlInput);
      htmlDiv.appendChild(htmlLabel);

      htmlAssessmentsList.appendChild(htmlDiv);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();
  fetchAssessments();

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

    const newModule = {
      name,
      credits,
      hours,
      learningOutcomes,
      assessmentIDs
    };

    try {
      const reqPost = await fetch("/api/modules/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newModule)
      });

      if (reqPost.status !== 201) {
        return;
      }

      const mod = await reqPost.json();

      const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`)

      if (reqDegreeProgramme.status !== 200) {
        return;
      }

      const degreeProgramme = (await reqDegreeProgramme.json())[0];

      const updatedDegreeProgramme = {
        ...degreeProgramme,
        moduleIDs: [
          ...degreeProgramme.moduleIDs,
          mod.id
        ]
      }

      await fetch(`/api/degreeProgrammes/${degreeProgrammeID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDegreeProgramme)
      });

      window.location.replace(`../../?id=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new module.");
    }
  });
});
