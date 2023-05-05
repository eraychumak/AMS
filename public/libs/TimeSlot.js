import { Academic } from "./Academic.js";
import { AcademicYear } from "./AcademicYear.js";
import { Mod } from "./Module.js";
import { Room } from "./Room.js";

/**
 * Provides an interface for interacting with timeslots in the database.
 */
export class TimeSlot {
  /**
   * Init
   * @param {Number} id - the unique identifier for the timeslot.
   * @param {String} day - the day of occurrence.
   * @param {String} timeStart - the time start of occurrence.
   * @param {String} timeEnd - the time end of occurrence.
   * @param {Number} academicYearID - the unique identifier of the academic year.
   * @param {Number} roomID - the unique identifier of the room.
   * @param {Number} academicID - the unique identifer of the academic.
   * @param {Number} moduleID - the unique identifer of the module.
   */
  constructor(id, day, timeStart, timeEnd, academicYearID, roomID, academicID, moduleID) {
    this.id = id;
    this.day = day;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.academicYearID = academicYearID;
    this.roomID = roomID;
    this.academicID = academicID
    this.moduleID = moduleID;
  }

  /**
   * Gets all timeslots from the database.
   * @param {Object|undefined} where - apply json-server url filters
   * @returns {Promise<Array<TimeSlot>>} - list of timeslots
   */
  static getAll(where) {
    console.log("[TimeSlot] getAll");

    return new Promise(async (res, rej) => {
      try {
        let path;

        if (where) {
          let query = [];

          for (const param in where) {
            const val = where[param];
            query.push(`${param}=${val}`);
          }

          path = `/api/timeslots?${query.join("&")}`;
        } else {
          path = "/api/timeslots";
        }

        const req = await fetch(path);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawTimeslots = await req.json();
        const timeslots = [];

        for (let x = 0; x < rawTimeslots.length; x++) {
          const rawTimeslot = rawTimeslots[x];

          timeslots.push(
            new TimeSlot(
              rawTimeslot.id,
              rawTimeslot.day,
              rawTimeslot.timeStart,
              rawTimeslot.timeEnd,
              rawTimeslot.academicYearID,
              rawTimeslot.roomID,
              rawTimeslot.academicID,
              rawTimeslot.moduleID
            )
          );
        }

        return res(timeslots);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets timeslot from the database.
   * @param {Number} ID - the unique identifer of the timeslot.
   * @returns {Promise<TimeSlot>} - timeslot.
   */
  static get(ID) {
    console.log(`[TimeSlot] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {;
        const req = await fetch(`/api/timeslots?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawTimeslot = (await req.json())[0];

        return res(
          new TimeSlot(
            rawTimeslot.id,
            rawTimeslot.day,
            rawTimeslot.timeStart,
            rawTimeslot.timeEnd,
            rawTimeslot.academicYearID,
            rawTimeslot.roomID,
            rawTimeslot.academicID,
            rawTimeslot.moduleID
          )
        );
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Create new timeslot in the database.
   * @param {String} day - the day of occurrence.
   * @param {String} timeStart - the time start of occurrence.
   * @param {String} timeEnd - the time end of occurrence.
   * @param {Number} academicYearID - the unique identifier of the academic year.
   * @param {Number} roomID - the unique identifier of the room.
   * @param {Number} academicID - the unique identifer of the academic.
   * @param {Number} moduleID - the unique identifer of the module.
   * @returns {Promise<Boolean>} - status of creation.
   */
  static create(day, timeStart, timeEnd, academicYearID, roomID, academicID, moduleID) {
    console.log("[TimeSlot] create");

    const newTimeslot = {
      day,
      timeStart,
      timeEnd,
      academicYearID,
      roomID,
      academicID,
      moduleID
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/timeslots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newTimeslot)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new timeslot"
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Update timeslot in the database.
   * @param {String} day - the day of occurrence.
   * @param {String} timeStart - the time start of occurrence.
   * @param {String} timeEnd - the time end of occurrence.
   * @param {Number} academicYearID - the unique identifier of the academic year.
   * @param {Number} roomID - the unique identifier of the room.
   * @param {Number} academicID - the unique identifer of the academic.
   * @param {Number} moduleID - the unique identifer of the module.
   * @returns {Promise<Boolean>} - status of creation.
   */
  update(day, timeStart, timeEnd, academicYearID, roomID, academicID, moduleID) {
    console.log(`[TimeSlot] [${this.id}] update`);

    const updatedTimeslot = {
      day,
      timeStart,
      timeEnd,
      academicYearID,
      roomID,
      academicID,
      moduleID
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/timeslots/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedTimeslot)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update timeslot"
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Deletes timeslot from the database.
   * @returns {Promise<Boolean>} - the status of deletion.
   */
  delete() {
    console.log(`[TimeSlot] [${this.id}] delete`);

    return new Promise(async (res, rej) => {
      try {;
        const req = await fetch(`/api/timeslots/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete timeslot from the database."
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  htmlWidgetContainer(degreeProgrammeID) {
    return new Promise(async (res, rej) => {
      try {
        const academicYear = await AcademicYear.get(this.academicYearID);
        const mod = await Mod.get(this.moduleID);
        const academic = await Academic.get(this.academicID);
        const room = await Room.get(this.roomID);

        if (!academicYear || !mod || !academic || !room) {
          return rej({
            err: true,
            msg: "Could not find academic year, module, academic, or room for the timeslot."
          });
        }

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
        const htmlTxtDayValue = document.createTextNode(this.day);
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
        const htmlTxtTimeStartValue = document.createTextNode(this.timeStart);
        htmlPTimeStartValue.appendChild(htmlTxtTimeStartValue);

        htmlTimeStartContainer.appendChild(htmlPTimeStart);
        htmlTimeStartContainer.appendChild(htmlPTimeStartValue);

        const htmlTimeEndContainer = document.createElement("div");
        htmlTimeEndContainer.classList.add("timeEndContainer");

        const htmlPTimeEnd = document.createElement("h3");
        const htmlTxtTimeEnd = document.createTextNode("End");
        htmlPTimeEnd.appendChild(htmlTxtTimeEnd);
        const htmlPTimeEndValue = document.createElement("p");
        const htmlTxtTimeEndValue = document.createTextNode(this.timeEnd);
        htmlPTimeEndValue.appendChild(htmlTxtTimeEndValue);

        htmlTimeEndContainer.appendChild(htmlPTimeEnd);
        htmlTimeEndContainer.appendChild(htmlPTimeEndValue);

        htmlTimeContainer.appendChild(htmlTimeStartContainer);
        htmlTimeContainer.appendChild(htmlTimeEndContainer);

        const htmlA = document.createElement("a");
        const htmlATxt = document.createTextNode("View");
        htmlA.href = `./timeslot?id=${this.id}&moduleID=${this.moduleID}&degreeProgrammeID=${degreeProgrammeID}`
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

        return res(htmlDiv);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }
}
