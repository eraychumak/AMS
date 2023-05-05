import { Academic } from "../../../libs/Academic.js";
import { AcademicYear } from "../../../libs/AcademicYear.js";
import { DegreeProgramme } from "../../../libs/DegreeProgramme.js";
import { Mod } from "../../../libs/Module.js";
import { Room } from "../../../libs/Room.js";
import { TimeSlot } from "../../../libs/TimeSlot.js";

const params = new URLSearchParams(window.location.search);

const timeslotID = params.get("id");
const moduleID = params.get("moduleID");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (timeslotID === null || moduleID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../?id=${degreeProgrammeID}`;
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

    htmlA.href = `../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`;
    htmlA.innerText = mod.name;
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAcademicYears(timeslot) {
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
      const option = academicYear.htmlOption(timeslot.academicYearID === academicYear.id);
      htmlAcademicYearsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchRooms(timeslot) {
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
      const option = room.htmlOption(timeslot.roomID === room.id);
      htmlRoomsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}

async function fetchAcademics(timeslot) {
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
      const option = academic.htmlOption(timeslot.academicID === academic.id);
      htmlAcademicsList.appendChild(option);
    });
  } catch (e) {
    alert(e.msg);
  }
}


window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const timeslot = await TimeSlot.get(timeslotID);

    if (!timeslot) {
      window.replace("/");
      return;
    }

    console.log(timeslot);

    fetchAcademicYears(timeslot);
    fetchRooms(timeslot);
    fetchAcademics(timeslot);

    const name = `${timeslot.day} between ${timeslot.timeStart} and ${timeslot.timeEnd}`;

    document.title = `AMS - ${name}`;

    updateHTMLHooks("useTimeslotName", name);
    updateHTMLHooks("useTimeslotTimeStart", timeslot.timeStart);
    updateHTMLHooks("useTimeslotTimeEnd", timeslot.timeEnd);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const htmlDaysList = document.getElementById("daysList");
    htmlDaysList.options.selectedIndex = days.indexOf(timeslot.day);

    // ? UPDATE TIMESLOT LOGIC - START
    const formUpdateTimeslot = document.getElementById("formUpdateTimeslot");

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

      try {
        const statusUpdate = await timeslot.update(
          day, timeStart, timeEnd, academicYearID, roomID, academicID, parseInt(moduleID)
        );

        if (statusUpdate) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE TIMESLOT LOGIC - END

    // ? DELETE TIMESLOT LOGIC - START
    const htmlDelTimeslot = document.getElementById("delTimeslot");
    htmlDelTimeslot.innerText = `Delete '${timeslot.day} between ${timeslot.timeStart} and ${timeslot.timeEnd}' timeslot`;

    htmlDelTimeslot.addEventListener("click", async (e) => {
      e.preventDefault();

      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The timeslot was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const statusDelete = await timeslot.delete();

        if (statusDelete) {
          window.location.replace(`../?id=${moduleID}&degreeProgrammeID=${degreeProgrammeID}`);
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE TIMESLOT LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
