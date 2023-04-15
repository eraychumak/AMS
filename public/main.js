function htmlTxt(label) {
  const p = document.createElement("p");
  const txt = document.createTextNode(label);

  p.appendChild(txt);
  return p;
}

function htmlSecondaryBtn(label, href = "#") {
  const a = document.createElement("a");
  const txt = document.createTextNode(label);

  a.appendChild(txt);
  a.classList.add("secondaryBtn");
  a.href = href;

  return a;
}

async function fetchAcademicYears() {
  const academicYearsList = document.getElementById("academicYearsList");
  academicYearsList.innerHTML = "";

  try {
    const req = await fetch("/api/academicYears");

    if (req.status !== 200) {
      return;
    }

    const payload = await req.json();

    for (let x = 0; x < payload.length; x++) {
      const academicYear = payload[x];
      const htmlAcademicYear = htmlSecondaryBtn(academicYear.name, `/academicYear?id=${academicYear.id}`);

      academicYearsList.appendChild(htmlAcademicYear);
    }
  } catch (e) {
    const errText = htmlTxt("Something went wrong.");
    academicYearsList.appendChild(errText);
  }
}

async function fetchDegreeProgreammes() {
  const degreeProgrammesList = document.getElementById("degreeProgrammesList");
  degreeProgrammesList.innerHTML = "";

  try {
    const req = await fetch("/api/degreeProgrammes");

    if (req.status !== 200) {
      return;
    }

    const payload = await req.json();

    for (let x = 0; x < payload.length; x++) {
      const degreeProgramme = payload[x];
      const htmlDegreeProgramme = htmlSecondaryBtn(degreeProgramme.name, `/degreeProgramme?id=${degreeProgramme.id}`);

      degreeProgrammesList.appendChild(htmlDegreeProgramme);
    }
  } catch (e) {
    const errText = htmlTxt("Something went wrong.");
    degreeProgrammesList.appendChild(errText);
  }
}

async function fetchAcademics() {
  const academicsList = document.getElementById("academicsList");
  academicsList.innerHTML = "";

  try {
    const req = await fetch("/api/academics");

    if (req.status !== 200) {
      return;
    }

    const payload = await req.json();

    for (let x = 0; x < payload.length; x++) {
      const academic = payload[x];
      const htmlAcademic = htmlSecondaryBtn(academic.fullName, `/academic?id=${academic.id}`);

      academicsList.appendChild(htmlAcademic);
    }
  } catch (e) {
    const errText = htmlTxt("Something went wrong.");
    academicsList.appendChild(errText);
  }
}

async function fetchRooms() {
  const roomsList = document.getElementById("roomsList");
  roomsList.innerHTML = "";

  try {
    const req = await fetch("/api/rooms");

    if (req.status !== 200) {
      return;
    }

    const payload = await req.json();

    for (let x = 0; x < payload.length; x++) {
      const room = payload[x];
      const htmlRoom = htmlSecondaryBtn(room.name, `/room?id=${room.id}`);

      roomsList.appendChild(htmlRoom);
    }
  } catch (e) {
    const errText = htmlTxt("Something went wrong.");
    roomsList.appendChild(errText);
  }
}

window.addEventListener("load", () => {
  fetchAcademicYears();
  fetchDegreeProgreammes();
  fetchAcademics();
  fetchRooms();
});
