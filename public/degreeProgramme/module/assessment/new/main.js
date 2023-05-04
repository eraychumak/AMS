const params = new URLSearchParams(window.location.search);

const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (moduleID === null || degreeProgrammeID === null) {
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
}

window.addEventListener("load", () => {
  updateBreadCrumbs();

  const formNewAssessment = document.getElementById("formNewAssessment");

  formNewAssessment.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const learningOutcomes = document.getElementById("learningOutcomes").value;
    const weight = parseFloat(document.getElementById("weight").value) / 100;
    const number = parseInt(document.getElementById("number").value);
    const volume = parseInt(document.getElementById("volume").value);

    const newAssessment = {
      title,
      learningOutcomes,
      weight,
      number,
      volume,
      submissionDateIDs: []
    };

    try {
      const reqPost = await fetch("/api/assessments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAssessment)
      });

      if (reqPost.status !== 201) {
        return;
      }

      const assessment = await reqPost.json();

      const reqModule = await fetch(`/api/modules?id=${moduleID}`)

      if (reqModule.status !== 200) {
        return;
      }

      const mod = (await reqModule.json())[0];

      const updatedModule = {
        ...mod,
        assessmentIDs: [
          ...mod.assessmentIDs,
          assessment.id
        ]
      }

      await fetch(`/api/modules/${moduleID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedModule)
      });

      window.location.replace(`../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new assessment.");
    }
  });
});
