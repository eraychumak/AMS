import { Academic } from "./libs/Academic.js";
import { AcademicYear } from "./libs/AcademicYear.js";
import { DegreeProgramme } from "./libs/DegreeProgramme.js";
import { Room } from "./libs/Room.js";

function htmlTxt(label) {
  const p = document.createElement("p");
  const txt = document.createTextNode(label);

  p.appendChild(txt);
  return p;
}

async function fetchAcademicYears() {
  const academicYearsList = document.getElementById("academicYearsList");
  academicYearsList.innerHTML = "";

  try {
    const academicYears = await AcademicYear.getAll();

    for (let x = 0; x < academicYears.length; x++) {
      const academicYear = academicYears[x];
      const htmlAcademicYear = htmlSecondaryBtn(academicYear.name, `/academicYear?id=${academicYear.id}`);

      academicYearsList.appendChild(htmlAcademicYear);
    }
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchDegreeProgreammes() {
  const degreeProgrammesList = document.getElementById("degreeProgrammesList");
  degreeProgrammesList.innerHTML = "";

  try {
    const degreeProgrammes = await DegreeProgramme.getAll();

    for (let x = 0; x < degreeProgrammes.length; x++) {
      const degreeProgramme = degreeProgrammes[x];
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
    const academics = await Academic.getAll();

    for (let x = 0; x < academics.length; x++) {
      const academic = academics[x];
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
    const rooms = await Room.getAll();

    for (let x = 0; x < rooms.length; x++) {
      const room = rooms[x];
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
