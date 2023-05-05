import { Academic } from "../../../../libs/Academic.js";
import { AcademicYear } from "../../../../libs/AcademicYear.js";
import { DegreeProgramme } from "../../../../libs/DegreeProgramme.js";
import { Mod } from "../../../../libs/Module.js";
import { Room } from "../../../../libs/Room.js";
import { TimeSlot } from "../../../../libs/TimeSlot.js";

const params = new URLSearchParams(window.location.search);

const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    alert(e.msg);
  }

  try {
    const mod = await Mod.get(moduleID);

    if (!mod) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("moduleBreadCrumb");

    htmlA.href = `../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAcademicYears() {
  try {
    const academicYears = await AcademicYear.getAll();
    const htmlAcademicYearsList = document.getElementById("academicYearsList");

    if (academicYears.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAcademicYearsList.replaceChild(htmlP);
      return;
    }

    academicYears.forEach(academicYear => {
      const option = academicYear.htmlOption();
      htmlAcademicYearsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchRooms() {
  try {
    const htmlRoomsList = document.getElementById("roomsList");
    const rooms = await Room.getAll();

    if (rooms.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlRoomsList.replaceChild(htmlP);
      return;
    }

    rooms.forEach(room => {
      const option = room.htmlOption();
      htmlRoomsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAcademics() {
  try {
    const academics = await Academic.getAll();
    const htmlAcademicsList = document.getElementById("academicsList");

    if (academics.length === 0) {
      const htmlP = document.createElement("p");
      const htmlTxt = document.createTextNode("Empty");

      htmlP.appendChild(htmlTxt);
      htmlAcademicsList.replaceChild(htmlP);
      return;
    }

    academics.forEach(academic => {
      const option = academic.htmlOption();
      htmlAcademicsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();

  fetchAcademicYears();
  fetchRooms();
  fetchAcademics();

  // ? NEW TIMESLOT LOGIC - START
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

    try {
      const statusCreate = await TimeSlot.create(
        day, timeStart, timeEnd, academicYearID, roomID, academicID, parseInt(moduleID)
      );

      if (statusCreate) {
        window.location.replace(`../../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
      }
    } catch (e) {
      alert(e.msg);
    }
  });
  // ? NEW TIMESLOT LOGIC - END
});