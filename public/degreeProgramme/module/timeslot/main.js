const params = new URLSearchParams(window.location.search);

const timeslotID = params.get("id");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (timeslotID === null || moduleID === null || degreeProgrammeID === null) {
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

async function fetchAcademicYears(currentAcademicYearID) {
  const htmlAcademicYearsList = document.getElementById("academicYearsList");

  try {
    const reqAcademicYears = await fetch("/api/academicYears");

    if (reqAcademicYears.status !== 200) {
      return;
    }

    const academicYears = await reqAcademicYears.json();

    if (academicYears.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAcademicYearsList.replaceChild(htmlP);
      return;
    }

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
    // TODO
    console.log(e);
  }
}

async function fetchRooms(currentRoomID) {
  const htmlRoomsList = document.getElementById("roomsList");

  try {
    const reqRooms = await fetch("/api/rooms");

    if (reqRooms.status !== 200) {
      return;
    }

    const rooms = await reqRooms.json();

    if (rooms.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlRoomsList.replaceChild(htmlP);
      return;
    }

    rooms.forEach(room => {
      const htmlOption = document.createElement("option");
      const htmlTxt = document.createTextNode(room.name);

      if (room.id === currentRoomID) {
        htmlOption.selected = true;
      }

      htmlOption.value = room.id;
      htmlOption.appendChild(htmlTxt);

      htmlRoomsList.appendChild(htmlOption);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

async function fetchAcademics(currentAcademicID) {
  const htmlAcademicsList = document.getElementById("academicsList");

  try {
    const reqAcademics = await fetch("/api/academics");

    if (reqAcademics.status !== 200) {
      return;
    }

    const academics = await reqAcademics.json();

    if (academics.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAcademicsList.replaceChild(htmlP);
      return;
    }

    academics.forEach(academic => {
      const htmlOption = document.createElement("option");
      const htmlTxt = document.createTextNode(academic.fullName);

      if (academic.id === currentAcademicID) {
        htmlOption.selected = true;
      }

      htmlOption.value = academic.id;
      htmlOption.appendChild(htmlTxt);

      htmlAcademicsList.appendChild(htmlOption);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const req = await fetch(`/api/timeslots?id=${timeslotID}`);

    if (req.status !== 200) {
      return;
    }

    const timeslot = (await req.json())[0];

    if (!timeslot) {
      window.replace("/");
      return;
    }

    fetchAcademicYears(timeslot.academicYearID);
    fetchRooms(timeslot.roomID);
    fetchAcademics(timeslot.academicID);

    const htmlNameElements = document.getElementsByClassName("useTimeslotName");

    document.title = `AMS - ${timeslot.day} between ${timeslot.timeStart} and ${timeslot.timeEnd}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      htmlNameElement.textContent = `${timeslot.day} between ${timeslot.timeStart} and ${timeslot.timeEnd}`;
    }

    const timeStart = document.getElementById("timeStart");
    timeStart.value = timeslot.timeStart;

    const timeEnd = document.getElementById("timeEnd");
    timeEnd.value = timeslot.timeEnd;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const htmlDaysList = document.getElementById("daysList");
    htmlDaysList.options.selectedIndex = days.indexOf(timeslot.day);

    formUpdateTimeslot.addEventListener("submit", async (e) => {
      e.preventDefault();

      const timeStart = document.getElementById("timeStart").value;
      const timeEnd = document.getElementById("timeEnd").value;

      const htmlDaysList = document.getElementById("daysList");
      const day = htmlDaysList.options[htmlDaysList.options.selectedIndex].value;

      const htmlAcademicYearsList = document.getElementById("academicYearsList");
      const academicYearID = parseInt(htmlAcademicYearsList.options[htmlAcademicYearsList.options.selectedIndex].value);

      const htmlRoomsList = document.getElementById("roomsList");
      const roomID = parseInt(htmlRoomsList.options[htmlRoomsList.options.selectedIndex].value);

      const htmlAcademicsList = document.getElementById("academicsList");
      const academicID = parseInt(htmlAcademicsList.options[htmlAcademicsList.options.selectedIndex].value);

      const updatedTimeslot = {
        timeStart,
        timeEnd,
        day,
        academicYearID,
        roomID,
        academicID,
        moduleID
      };

      try {
        await fetch(`/api/timeslots/${timeslot.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedTimeslot)
        });

        window.location.reload();
      } catch (err) {
        e.preventDefault();
        alert("Failed to create new timeslot.");
      }
    });

    const htmlDelTimeslot = document.getElementById("delTimeslot");
    htmlDelTimeslot.innerText = `Delete '${timeslot.day} between ${timeslot.timeStart} and ${timeslot.timeEnd}' timeslot`;

    htmlDelTimeslot.addEventListener("click", async (e) => {
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        e.preventDefault();
        alert("The timeslot was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        await fetch(`/api/timeslots/${timeslot.id}`, {
          method: "DELETE"
        });

        window.location.replace(`../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      } catch (err) {
        e.preventDefault();
        alert("Failed to delete timeslot.");
      }
    });
  } catch (e) {
    console.log(e);
    // TODO
  }
});
