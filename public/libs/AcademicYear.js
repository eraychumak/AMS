import { SubmissionDate } from "./SubmissionDate.js";
import { TimeSlot } from "./TimeSlot.js";

/**
 * Provides an interface for interacting with academic years in the database.
 */
export class AcademicYear {
  /**
   * Init
   * @param {Number} id - the unique identifier for the academic year.
   * @param {String} name - the name of the academic year.
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Gets all academic years from the database.
   * @returns {Promise<Array<AcademicYear>>} - list of academic years.
   */
  static getAll() {
    console.log("[AcademicYear] getAll");

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/academicYears");

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAcademicYears = await req.json();
        const academicYears = [];

        for (let x = 0; x < rawAcademicYears.length; x++) {
          const rawAcademicYear = rawAcademicYears[x];

          academicYears.push(
            new AcademicYear(
              rawAcademicYear.id,
              rawAcademicYear.name
            )
          );
        }

        return res(academicYears);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets academic year by ID from the database.
   * @returns {Promise<AcademicYear>} - academic year.
   */
  static get(ID) {
    console.log(`[AcademicYear] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academicYears?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAcademicYear = (await req.json())[0];

        return res(
          new AcademicYear(
            rawAcademicYear.id,
            rawAcademicYear.name
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
   * Create new academic year in the database.
   * @param {String} name - the name of the academic year.
   * @returns {Promise<Boolean>} - status of creation.
   */
  static create(name) {
    console.log(`[AcademicYear] [${name}] create`);

    const newAcademicYear = {
      name
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/academicYears", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newAcademicYear)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new academic year"
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
   * Update academic year in the database.
   * @param {String} name - the name of the academic year.
   * @returns {Promise<Boolean>} - status of update.
   */
  update(name) {
    console.log(`[AcademicYear] [${this.id}] update`);

    const updatedAcademicYear = {
      name
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academicYears/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAcademicYear)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update the academic year"
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
   * Delete academic year from database.
   * @returns {Promise<Boolean>} - status of deletion.
   */
  delete() {
    console.log(`[Academic Year] [${this.name}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/academicYears/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the academic year"
          });
        }

        const timeslots = await TimeSlot.getAll({
          academicYearID: this.id
        });

        const submissionDates = await SubmissionDate.getAll({
          academicYearID: this.id
        });

        timeslots.forEach(async (timeslot) => {
          await timeslot.delete();
        });

        submissionDates.forEach(async (submissionDate) => {
          await submissionDate.delete();
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
    const htmlTxt = document.createTextNode(this.name);

    htmlOption.selected = selected;
    htmlOption.value = this.id;
    htmlOption.appendChild(htmlTxt);

    return htmlOption;
  }

  htmlDropdownSection() {
    const htmlFormFieldAcademicYear = document.createElement("section");
    htmlFormFieldAcademicYear.classList.add("formField");

    const htmlLabelAcademicYear = document.createElement("label");
    const htmlTxtAcademicYear = document.createTextNode(this.name);
    htmlLabelAcademicYear.appendChild(htmlTxtAcademicYear);

    htmlFormFieldAcademicYear.appendChild(htmlLabelAcademicYear);

    const htmlSelectSubmissionDatesList = document.createElement("select");
    htmlSelectSubmissionDatesList.name = `submissionDatesList-${this.id}`;
    htmlSelectSubmissionDatesList.id = `submissionDatesList-${this.id}`;

    const htmlOptionNone = document.createElement("option");
    const htmlTxtNone = document.createTextNode("None");

    htmlOptionNone.appendChild(htmlTxtNone);

    htmlOptionNone.value = "";
    htmlSelectSubmissionDatesList.appendChild(htmlOptionNone);

    return [
      htmlFormFieldAcademicYear,
      htmlSelectSubmissionDatesList
    ];
  }
}
