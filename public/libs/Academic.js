import { TimeSlot } from "./TimeSlot.js";

/**
 * Provides an interface for interacting with academics in the database.
 */
export class Academic {
  /**
   * Init
   * @param {Number} id - the unique identifier for the academic.
   * @param {String} fullName - the full name of the academic.
   */
  constructor(id, fullName) {
    this.id = id;
    this.fullName = fullName;
  }

  /**
   * Gets all academics from the database.
   * @returns {Promise<Array<Academic>>} - list of academics.
   */
  static getAll() {
    console.log("[Academic] getAll");

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/academics");

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAcademics = await req.json();
        const academics = [];

        for (let x = 0; x < rawAcademics.length; x++) {
          const rawAcademic = rawAcademics[x];

          academics.push(
            new Academic(
              rawAcademic.id,
              rawAcademic.fullName
            )
          );
        }

        return res(academics);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets academic by ID from the database.
   * @returns {Promise<Academic>} - academic.
   */
  static get(ID) {
    console.log(`[Academic] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academics?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAcademic = (await req.json())[0];

        return res(
          new Academic(
            rawAcademic.id,
            rawAcademic.fullName
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
   * Create new academic in the database.
   * @param {String} fullName - the full name of the academic.
   * @returns {Promise<Boolean>} - status of creation.
   */
  static create(fullName) {
    console.log(`[AcademicYear] [${fullName}] create`);

    const newAcademic = {
      fullName
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/academics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newAcademic)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new academic"
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
   * Update academic in the database.
   * @param {String} fullName - the name of the academic.
   * @returns {Promise<Boolean>} - status of update.
   */
  update(fullName) {
    console.log(`[AcademicYear] [${this.id}] update`);

    const updatedAcademic = {
      fullName
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academics/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAcademic)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update the academic"
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
   * Delete academic from database.
   * @returns {Promise<Boolean>} - status of deletion.
   */
  delete() {
    console.log(`[Academic] [${this.fullName}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academics/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the academic."
          });
        }

        const timeslots = await TimeSlot.getAll({
          academicID: this.id
        });

        timeslots.forEach(async (timeslot) => {
          await timeslot.delete();
        });

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  htmlOption(selected) {
    const htmlOption = document.createElement("option");
    const htmlTxt = document.createTextNode(this.fullName);

    htmlOption.selected = selected;
    htmlOption.value = this.id;
    htmlOption.appendChild(htmlTxt);

    return htmlOption;
  }
}
