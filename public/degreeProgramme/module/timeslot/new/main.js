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

async function fetchAcademicYears() {
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

      htmlOption.value = academicYear.id;
      htmlOption.appendChild(htmlTxt);

      htmlAcademicYearsList.appendChild(htmlOption);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

async function fetchRooms() {
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

      htmlOption.value = room.id;
      htmlOption.appendChild(htmlTxt);

      htmlRoomsList.appendChild(htmlOption);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

async function fetchAcademics() {
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

      htmlOption.value = academic.id;
      htmlOption.appendChild(htmlTxt);

      htmlAcademicsList.appendChild(htmlOption);
    });
  } catch (e) {
    // TODO
    console.log(e);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();
  fetchAcademicYears();
  fetchRooms();
  fetchAcademics();

  const formNewTimeslot = document.getElementById("formNewTimeslot");

  formNewTimeslot.addEventListener("submit", async (e) => {
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

    const newTimeslot = {
      timeStart,
      timeEnd,
      day,
      academicYearID,
      roomID,
      academicID,
      moduleID
    };

    try {
      await fetch("/api/timeslots/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTimeslot)
      });

      window.location.replace(`../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new timeslot.");
    }
  });
});