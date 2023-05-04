const params = new URLSearchParams(window.location.search);

const moduleID = params.get("id");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

function wPercent(weight) {
  return Math.round(weight * 100) + "%"
}

function calcWeights(assessments) {
  let totalWeight = 0;

  assessments.forEach(assessment => {
    totalWeight += assessment.weight;
  });

  return totalWeight = [wPercent(totalWeight), totalWeight];
}

async function fetchAllAssessments(moduleAssessmentIDs) {
  const htmlAssessmentsList = document.getElementById("assessmentsList");

  try {
    const req = await fetch("/api/assessments");

    if (req.status !== 200) {
      return;
    }

    const assessments = await req.json();

    if (assessments.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAssessmentsList.appendChild(htmlP);
      return;
    }

    const moduleAssessments = assessments.filter(assessment => moduleAssessmentIDs.includes(assessment.id));

    const totalAssessmentWeights = calcWeights(moduleAssessments);

    const htmlTotalAssessmentWeight = document.getElementById("totalAssessmentWeight");
    htmlTotalAssessmentWeight.innerText = totalAssessmentWeights[0];

    if (Math.round(totalAssessmentWeights[1]) > 1) {
      const htmlCreateNewAssessment = document.getElementById("createNewAssessment");
      htmlCreateNewAssessment.href = "#";
      htmlCreateNewAssessment.onclick = (e) => {
        e.preventDefault();

        alert("The weighting of all module assessments cannot go over 100%.\n\nYou may remove an assessment or reduce an assessment's weight to create another one.")
      };
    }

    assessments.forEach(assessment => {
      const htmlDiv = document.createElement("div");
      const htmlInput = document.createElement("input");
      const htmlLabel = document.createElement("label");
      const htmlLabelText = document.createTextNode(`CIS${assessment.number} - ${assessment.title} - ${wPercent(assessment.weight)}`);

      htmlDiv.classList.add("checkboxField");

      htmlInput.type = "checkbox";
      htmlInput.id = assessment.id;
      htmlInput.dataset.assessementWeight = assessment.weight;
      htmlInput.name = assessment.id;
      htmlInput.checked = moduleAssessmentIDs.includes(assessment.id);

      htmlLabel.htmlFor = assessment.id;
      htmlLabel.appendChild(htmlLabelText);

      htmlDiv.appendChild(htmlInput);
      htmlDiv.appendChild(htmlLabel);

      htmlAssessmentsList.appendChild(htmlDiv);
    });
  } catch (e) {
    console.log(e)
    // TODO
  }
}

async function fetchModuleAssessments(moduleAssessmentIDs) {
  const htmlModuleAssessmentsList = document.getElementById("moduleAssessmentsList");
  const htmlModuleSubmissionDatesList = document.getElementById("moduleSubmissionDatesList");

  moduleAssessmentIDs.forEach(async (assessmentID) => {
    try {
      const reqAssessment = await fetch(`/api/assessments?id=${assessmentID}`);

      if (reqAssessment.status !== 200) {
        return;
      }

      const assessment = (await reqAssessment.json())[0];

      if (moduleAssessmentIDs.includes(assessment.id)) {
        const html = htmlSecondaryBtn(`CIS${assessment.number} - ${assessment.title}`, `./assessment?id=${assessment.id}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
        htmlModuleAssessmentsList.appendChild(html);
      }

      assessment.submissionDateIDs.forEach(async (submissionDateID) => {
        try {
          const reqSubmissionDate = await fetch(`/api/submissionDates?id=${submissionDateID}`);

          if (reqSubmissionDate.status !== 200) {
            return;
          }

          const submissionDate = (await reqSubmissionDate.json())[0];

          htmlModuleSubmissionDatesList.appendChild(htmlSecondaryBtn(
            submissionDate.name,
            `./submissionDate?id=${submissionDateID}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`
          ));
        } catch (e) {
          // TODO
          console.log(e);
        }
      });
    } catch (e) {
      // TODO
      console.log(e);
    }
  })
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

    htmlA.href = `../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {

  }
}

async function fetchTimeslots() {
  const htmlModuleTimeslotList = document.getElementById("moduleTimeslotList");

  try {
    const reqTimeslots = await fetch(`/api/timeslots?moduleID=${moduleID}`);

    if (reqTimeslots.status !== 200) {
      return;
    }

    const timeslots = await reqTimeslots.json();

    timeslots.forEach(async timeslot => {
      const reqAcademicYear = await fetch(`/api/academicYears?id=${timeslot.academicYearID}`);

      if (reqAcademicYear.status !== 200) {
        return;
      }

      const academicYear = (await reqAcademicYear.json())[0];

      const reqModule = await fetch(`/api/modules?id=${moduleID}`);

      if (reqModule.status !== 200) {
        return;
      }

      const mod = (await reqModule.json())[0];

      const reqAcademic = await fetch(`/api/academics?id=${timeslot.academicID}`);

      if (reqAcademic.status !== 200) {
        return;
      }

      const academic = (await reqAcademic.json())[0];

      const reqRoom = await fetch(`/api/rooms?id=${timeslot.roomID}`);

      if (reqRoom.status !== 200) {
        return;
      }

      const room = (await reqRoom.json())[0];

      const htmlDiv = document.createElement("div");
      htmlDiv.classList.add("timeslot");

      const htmlPAcademicYear = document.createElement("h3");
      const htmlTxtAcademicYear = document.createTextNode("Academic Year");
      htmlPAcademicYear.appendChild(htmlTxtAcademicYear);
      const htmlPAcademicYearValue = document.createElement("p");
      const htmlTxtAcademicYearValue = document.createTextNode(academicYear.name);
      htmlPAcademicYearValue.appendChild(htmlTxtAcademicYearValue);

      const htmlPModule = document.createElement("h3");
      const htmlTxtModule = document.createTextNode("Module");
      htmlPModule.appendChild(htmlTxtModule);
      const htmlPModuleValue = document.createElement("p");
      const htmlTxtModuleValue = document.createTextNode(mod.name);
      htmlPModuleValue.appendChild(htmlTxtModuleValue);

      const htmlPAcademic = document.createElement("h3");
      const htmlTxtAcademic = document.createTextNode("Academic");
      htmlPAcademic.appendChild(htmlTxtAcademic);
      const htmlPAcademicValue = document.createElement("p");
      const htmlTxtAcademicValue = document.createTextNode(academic.fullName);
      htmlPAcademicValue.appendChild(htmlTxtAcademicValue);

      const htmlRoomContainer = document.createElement("div");
      htmlRoomContainer.classList.add("roomContainer");

      const htmlPRoom = document.createElement("h3");
      const htmlTxtRoom = document.createTextNode("Room");
      htmlPRoom.appendChild(htmlTxtRoom);
      const htmlPRoomValue = document.createElement("p");
      const htmlTxtRoomValue = document.createTextNode(room.name);
      htmlPRoomValue.appendChild(htmlTxtRoomValue);

      htmlRoomContainer.appendChild(htmlPRoom);
      htmlRoomContainer.appendChild(htmlPRoomValue);

      const htmlDayContainer = document.createElement("div");
      htmlDayContainer.classList.add("dayContainer");

      const htmlPDay = document.createElement("h3");
      const htmlTxtDay = document.createTextNode("Day");
      htmlPDay.appendChild(htmlTxtDay);
      const htmlPDayValue = document.createElement("p");
      const htmlTxtDayValue = document.createTextNode(timeslot.day);
      htmlPDayValue.appendChild(htmlTxtDayValue);

      htmlDayContainer.appendChild(htmlPDay);
      htmlDayContainer.appendChild(htmlPDayValue);

      const htmlTimeContainer = document.createElement("div");
      htmlTimeContainer.classList.add("timeContainer");

      const htmlTimeStartContainer = document.createElement("div");
      htmlTimeStartContainer.classList.add("timeStartContainer");

      const htmlPTimeStart = document.createElement("h3");
      const htmlTxtTimeStart = document.createTextNode("Start");
      htmlPTimeStart.appendChild(htmlTxtTimeStart);
      const htmlPTimeStartValue = document.createElement("p");
      const htmlTxtTimeStartValue = document.createTextNode(timeslot.timeStart);
      htmlPTimeStartValue.appendChild(htmlTxtTimeStartValue);

      htmlTimeStartContainer.appendChild(htmlPTimeStart);
      htmlTimeStartContainer.appendChild(htmlPTimeStartValue);

      const htmlTimeEndContainer = document.createElement("div");
      htmlTimeEndContainer.classList.add("timeEndContainer");

      const htmlPTimeEnd = document.createElement("h3");
      const htmlTxtTimeEnd = document.createTextNode("End");
      htmlPTimeEnd.appendChild(htmlTxtTimeEnd);
      const htmlPTimeEndValue = document.createElement("p");
      const htmlTxtTimeEndValue = document.createTextNode(timeslot.timeEnd);
      htmlPTimeEndValue.appendChild(htmlTxtTimeEndValue);

      htmlTimeEndContainer.appendChild(htmlPTimeEnd);
      htmlTimeEndContainer.appendChild(htmlPTimeEndValue);

      htmlTimeContainer.appendChild(htmlTimeStartContainer);
      htmlTimeContainer.appendChild(htmlTimeEndContainer);

      const htmlA = document.createElement("a");
      const htmlATxt = document.createTextNode("View");
      htmlA.href = `./timeslot?id=${timeslot.id}&moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`
      htmlA.appendChild(htmlATxt);

      htmlDiv.appendChild(htmlPAcademicYear);
      htmlDiv.appendChild(htmlPAcademicYearValue);
      htmlDiv.appendChild(htmlPModule);
      htmlDiv.appendChild(htmlPModuleValue);
      htmlDiv.appendChild(htmlPAcademic);
      htmlDiv.appendChild(htmlPAcademicValue);
      htmlDiv.appendChild(htmlRoomContainer);
      htmlDiv.appendChild(htmlDayContainer);
      htmlDiv.appendChild(htmlTimeContainer);
      htmlDiv.appendChild(htmlA);

      htmlModuleTimeslotList.appendChild(htmlDiv);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  const htmlCreateNewAssessment = document.getElementById("createNewAssessment");
  htmlCreateNewAssessment.href = `./assessment/new/?moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;

  const htmlCreateNewTimeslot = document.getElementById("createNewTimeslot");
  htmlCreateNewTimeslot.href = `./timeslot/new/?moduleID=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;

  try {
    const reqModule = await fetch(`/api/modules?id=${moduleID}`);

    if (reqModule.status !== 200) {
      return;
    }

    const mod = (await reqModule.json())[0];

    if (!mod) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useModuleName");

    document.title = `AMS - ${mod.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = mod.name;
        continue;
      }

      htmlNameElement.textContent = mod.name;
    }

    const htmlCredits = document.getElementById("credits");
    htmlCredits.value = mod.credits;

    const htmlHours = document.getElementById("hours");
    htmlHours.value = mod.hours;

    const htmlLearningOutcomes = document.getElementById("learningOutcomes");
    htmlLearningOutcomes.value = mod.learningOutcomes;

    const htmlDelModule = document.getElementById("delModule");
    htmlDelModule.innerText = `Delete '${mod.name}' module`;

    htmlDelModule.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("The following will also be deleted with the module:\n - Timeslots created for the module\n\nType 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The module was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/modules/${mod.id}`, {
          method: "DELETE"
        });

        const reqDegreeProgrammes = await fetch("/api/degreeProgrammes");

        if (reqDegreeProgrammes.status !== 200) {
          return;
        }

        const degreeProgrammes = await reqDegreeProgrammes.json();

        degreeProgrammes.forEach(async (degreeProgramme) => {
          if (!degreeProgramme.moduleIDs.includes(mod.id)) {
            return;
          }

          const updatedModuleIDs = degreeProgramme.moduleIDs.filter(modID => mod.id !== modID);

          const updatedDegreeProgramme = {
            ...degreeProgramme,
            moduleIDs: updatedModuleIDs
          };

          try {
            await fetch(`/api/degreeProgrammes/${degreeProgramme.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedDegreeProgramme)
            });

            window.location.replace(`../id=${degreeProgramme.id}`);
          } catch (e) {
            console.log(e);
            // TODO
          }
        });

        const reqTimeslots = await fetch("/api/timeslots");

        if (reqTimeslots.status !== 200) {
          return;
        }

        const timeslots = await reqTimeslots.json();

        timeslots.forEach(async (timeslot) => {
          if (timeslot.moduleID !== mod.id) {
            return;
          }

          try {
            await fetch(`/api/timeslots/${timeslot.id}`, {
              method: "DELETE"
            });
          } catch (e) {
            console.log(e);
            // TODO
          }
        });

        window.location.replace(`../?id=${degreeProgrammeID}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete module.");
      }
    });

    fetchAllAssessments(mod.assessmentIDs);
    fetchModuleAssessments(mod.assessmentIDs);
    fetchTimeslots();

    const formUpdateModule = document.getElementById("formUpdateModule");

    formUpdateModule.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const credits = parseInt(document.getElementById("credits").value);
      const hours = parseInt(document.getElementById("hours").value);
      const learningOutcomes = document.getElementById("learningOutcomes").value;

      const selectedAssessments = document.querySelectorAll("#assessmentsList input[type=checkbox]:checked");
      const assessmentIDs = [];
      let totalWeight = 0;

      selectedAssessments.forEach(assessment => {
        if (assessment.checked) {
          assessmentIDs.push(parseInt(assessment.id));
          totalWeight += parseFloat(assessment.dataset.assessementWeight);
        }
      });

      if (Math.round(totalWeight) > 1) {
        alert("Assessment weight cannot be over 100%.");
        return;
      }

      const updatedModule = {
        name,
        credits,
        hours,
        learningOutcomes,
        assessmentIDs
      };

      try {
        await fetch(`/api/modules/${moduleID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedModule)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to update module.");
      }
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
});
