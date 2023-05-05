import { Assessment } from "./Assessment.js";

/**
 * Provides an interface for interacting with submission dates in the database.
 */
export class SubmissionDate {
  /**
   * Init
   * @param {Number} id - the unique identifier for the submission date.
   * @param {String} name - the name of the submission date.
   * @param {Number} academicYearID - the unique identifier for the academic year.
   * @param {Date} deadline - the deadline date.
   */
  constructor(id, name, academicYearID, deadline) {
    this.id = id;
    this.name = name;
    this.academicYearID = academicYearID;
    this.deadline = deadline;
  }

  /**
   * Gets all submission dates from the database.
   * @param {Object|undefined} where - apply json-server url filters
   * @returns {Promise<Array<SubmissionDate>>} - list of submission dates.
   */
  static getAll(where) {
    console.log("[Submission Date] getAll");

    return new Promise(async (res, rej) => {
      try {
        let path;

        if (where) {
          let query = [];

          for (const param in where) {
            const val = where[param];
            query.push(`${param}=${val}`);
          }

          path = `/api/submissionDates?${query.join("&")}`;
        } else {
          path = "/api/submissionDates";
        }

        const req = await fetch(path);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawSubmissionDates = await req.json();
        const submissionDates = [];

        for (let x = 0; x < rawSubmissionDates.length; x++) {
          const rawSubmissionDate = rawSubmissionDates[x];

          submissionDates.push(
            new SubmissionDate(
              rawSubmissionDate.id,
              rawSubmissionDate.name,
              rawSubmissionDate.academicYearID,
              rawSubmissionDate.deadline
            )
          );
        }

        return res(submissionDates);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets all submission dates from the database.
   * @param {String} name - the name of the submission date.
   * @param {Number} academicYearID - the unique identifier for the academic year.
   * @param {Date} deadline - the deadline date.
   * @param {Date} assessmentID - the unique identifier for the assessment to assign the new submission date to.
   */
  static create(name, academicYearID, deadline, assessmentID) {
    console.log("[Submission Date] create");

    const newSubmissionDate = {
      name,
      academicYearID,
      deadline
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/submissionDates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newSubmissionDate)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create submission date."
          });
        }

        const rawSubmissionDate = await req.json();

        const assessment = await Assessment.get(assessmentID);
        await assessment.addSubmissionDate(rawSubmissionDate.id);

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Update submission date by ID from the database.
   * @param {String} name - the name of the submission date.
   * @param {Number} academicYearID - the unique identifier for the academic year.
   * @param {Date} deadline - the deadline date.
   * @param {Date} assessmentID - the unique identifier for the assessment to assign the submission date to.
   * @returns {Promise<Boolean>} - the status of update.
   */
  update(name, academicYearID, deadline, assessmentID) {
    console.log(`[Submission Date] [${this.id}] update`);

    const updatedSubmissionDate = {
      name,
      academicYearID,
      deadline
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/submissionDates/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedSubmissionDate)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update submission date."
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Get submission dates by ID from the database.
   * @returns {Promise<SubmissionDate>} - submission dates.
   */
  static get(ID) {
    console.log(`[Submission Date] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/submissionDates/${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawSubmissionDate = await req.json();

        return res(
          new SubmissionDate(
            rawSubmissionDate.id,
            rawSubmissionDate.name,
            rawSubmissionDate.academicYearID,
            rawSubmissionDate.deadline
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
   * Delete submission date from database.
   * @returns {Promise<Boolean>} - status of success
   */
  delete() {
    console.log(`[Submission Date] [${this.title}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/submissionDates/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the submission date"
          });
        }

        const filters = {
          submissionDateIDs_like: this.id
        };

        const assessments = await Assessment.getAll(filters);

        assessments.forEach(async (assessment) => {
          await assessment.removeSubmissionDate(this.id);
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
    const htmlTxt = document.createTextNode(`${this.name} (${new Date(this.deadline).toDateString()})`);

    htmlOption.appendChild(htmlTxt);

    htmlOption.value = this.id;
    htmlOption.selected = selected;

    return htmlOption;
  }
}
